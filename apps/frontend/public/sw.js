/* Filmam offline layer. Keep media/video requests out of every cache. */
const VERSION = "filmam-pwa-v1";
const ASSET_CACHE = `${VERSION}-assets`;
const API_CACHE = `${VERSION}-api`;
const PAGE_CACHE = `${VERSION}-pages`;
const DB_NAME = `${VERSION}-outbox`;
const DB_VERSION = 1;
const SYNC_TAG = "filmam-offline-outbox";
const MAX_ASSETS = 120;
const MAX_API_ENTRIES = 120;
const MAX_PAGE_ENTRIES = 16;
const MAX_API_ITEM_BYTES = 3 * 1024 * 1024;
const MAX_PAGE_ITEM_BYTES = 4 * 1024 * 1024;
const MAX_QUEUE_ITEMS = 100;
const MAX_QUEUE_BODY_BYTES = 256 * 1024;
const CACHE_TTL_MS = 14 * 24 * 60 * 60 * 1000;
const STORAGE_BUDGET_BYTES = 120 * 1024 * 1024;
let activeUserScope = "unknown";

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames
      .filter((name) => name.startsWith("filmam-pwa-") && !name.startsWith(VERSION))
      .map((name) => caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener("message", (event) => {
  const message = event.data;
  if (!message || typeof message !== "object") return;

  if (message.type === "SET_USER_SCOPE") {
    event.waitUntil(updateUserScope(message.userId));
  }

  if (message.type === "CLIENT_ONLINE") {
    event.waitUntil((async () => {
      if (message.userId !== undefined) await updateUserScope(message.userId);
      await flushOutbox();
    })());
  }
});

self.addEventListener("sync", (event) => {
  if (event.tag === SYNC_TAG) event.waitUntil(flushOutbox());
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  if (request.method === "GET" && isVideoRequest(request, url)) return;

  if (url.origin === self.location.origin && url.pathname.startsWith("/api/")) {
    if (request.method === "GET") {
      event.respondWith(networkFirstApi(request));
      return;
    }
    if (isMutationMethod(request.method)) {
      event.respondWith(networkOrQueueMutation(request));
      return;
    }
  }

  if (request.method === "GET" && url.origin === self.location.origin && isPageRequest(request)) {
    event.respondWith(networkFirstPage(request));
    return;
  }

  if (request.method === "GET" && isCacheableAsset(request, url)) {
    event.respondWith(networkFirstAsset(request));
  }
});

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains("outbox")) {
        database.createObjectStore("outbox", { keyPath: "id", autoIncrement: true });
      }
      if (!database.objectStoreNames.contains("meta")) {
        database.createObjectStore("meta", { keyPath: "key" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function getMeta(key) {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction("meta", "readonly");
    const request = transaction.objectStore("meta").get(key);
    request.onsuccess = () => resolve(request.result?.value);
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => database.close();
  });
}

async function setMeta(key, value) {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction("meta", "readwrite");
    transaction.objectStore("meta").put({ key, value });
    transaction.oncomplete = () => { database.close(); resolve(); };
    transaction.onerror = () => { database.close(); reject(transaction.error); };
  });
}

async function getUserScope() {
  if (activeUserScope !== "unknown") return activeUserScope;
  const stored = await getMeta("userScope").catch(() => undefined);
  activeUserScope = typeof stored === "string" ? stored : "unknown";
  return activeUserScope;
}

async function updateUserScope(userId) {
  const previous = await getUserScope();
  const next = userId == null ? "guest" : `user-${String(userId)}`;
  activeUserScope = next;
  await setMeta("userScope", next);
  if (previous.startsWith("user-") && previous !== next) await clearUserCache(previous);
}

async function clearUserCache(scope) {
  for (const cacheName of [API_CACHE, PAGE_CACHE]) {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    await Promise.all(keys.filter((key) => {
      try { return new URL(key.url).searchParams.get("__filmam_scope") === scope; }
      catch { return false; }
    }).map((key) => cache.delete(key)));
  }
}

function cacheKey(request, scope) {
  const url = new URL(request.url);
  url.searchParams.set("__filmam_scope", scope);
  return new Request(url.href, {
    method: "GET",
    headers: request.headers,
    credentials: "omit",
  });
}

function isVideoRequest(request, url) {
  return request.destination === "video" ||
    request.headers.has("range") ||
    /\.(?:mp4|m4v|mov|webm|m3u8|mpd|m4s|ts)(?:$|[?#])/i.test(url.href) ||
    /(?:^|\s)(?:video|application\/(?:vnd\.apple\.mpegurl|dash\+xml))/.test(request.headers.get("accept") || "");
}

function isPageRequest(request) {
  return request.mode === "navigate" || request.headers.get("RSC") === "1";
}

function isCacheableAsset(request, url) {
  if (isVideoRequest(request, url)) return false;
  if (request.destination === "image" || request.destination === "font") return true;
  return url.origin === self.location.origin &&
    (url.pathname.startsWith("/_next/static/") || /\.(?:avif|bmp|gif|ico|jpe?g|png|svg|webp|woff2?|ttf|otf)$/i.test(url.pathname));
}

function isMutationMethod(method) {
  return ["POST", "PUT", "PATCH", "DELETE"].includes(method.toUpperCase());
}

function isAuthOrUploadRequest(url) {
  return /\/api\/(?:auth|upload|uploads)(?:\/|$)/i.test(url.pathname);
}

function requiresUser(url) {
  return /\/api\/(?:user(?:-movie)?|comment|notification)(?:\/|$)/i.test(url.pathname);
}

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });
}

async function readResponseForCache(response, maxBytes) {
  if (!response.ok || response.status !== 200 || response.type === "opaque" || response.headers.has("set-cookie")) return null;
  if (/no-store/i.test(response.headers.get("cache-control") || "")) return null;
  const contentType = response.headers.get("content-type") || "";
  if (!/(?:application\/json|text\/x-component|text\/html)/i.test(contentType)) return null;
  const body = await response.clone().arrayBuffer();
  if (body.byteLength > maxBytes) return null;
  const headers = new Headers(response.headers);
  headers.set("X-Filmam-Cached-At", String(Date.now()));
  headers.set("X-Filmam-Cache-Size", String(body.byteLength));
  return new Response(body, { status: response.status, statusText: response.statusText, headers });
}

async function pruneCache(cache, maxEntries) {
  const keys = await cache.keys();
  const excess = keys.length - maxEntries;
  if (excess <= 0) return;
  await Promise.all(keys.slice(0, excess).map((key) => cache.delete(key)));
}

async function enforceStorageBudget() {
  if (!self.navigator.storage?.estimate) return;
  let estimate = await self.navigator.storage.estimate().catch(() => null);
  if (!estimate?.quota || estimate.usage == null) return;
  const budget = Math.min(STORAGE_BUDGET_BYTES, estimate.quota * 0.75);
  if (estimate.usage <= budget) return;

  for (const cacheName of [ASSET_CACHE, PAGE_CACHE, API_CACHE]) {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    const removeCount = Math.max(1, Math.ceil(keys.length * 0.2));
    await Promise.all(keys.slice(0, removeCount).map((key) => cache.delete(key)));
    estimate = await self.navigator.storage.estimate().catch(() => null);
    if (!estimate?.usage || estimate.usage <= budget) break;
  }
}

async function networkFirstApi(request) {
  const scope = await getUserScope();
  const key = cacheKey(request, scope);
  const cache = await caches.open(API_CACHE);

  try {
    const response = await fetch(new Request(request, { cache: "no-store" }));
    const cacheResponse = await readResponseForCache(response, MAX_API_ITEM_BYTES);
    if (cacheResponse) {
      try {
        await cache.put(key, cacheResponse);
        await pruneCache(cache, MAX_API_ENTRIES);
        await enforceStorageBudget();
      } catch {
        // A full browser cache must never turn a successful online response into an error.
      }
    }
    return response;
  } catch {
    const cached = await cache.match(key);
    if (cached) {
      const cachedAt = Number(cached.headers.get("X-Filmam-Cached-At") || 0);
      if (cachedAt && Date.now() - cachedAt <= CACHE_TTL_MS) return cached;
      await cache.delete(key);
    }
    return jsonResponse({ success: false, offline: true, message: "No cached response is available for this request." }, 503);
  }
}

async function networkFirstPage(request) {
  const scope = await getUserScope();
  const key = cacheKey(request, scope);
  const cache = await caches.open(PAGE_CACHE);

  try {
    const response = await fetch(new Request(request, { cache: "no-store" }));
    const cacheResponse = await readResponseForCache(response, MAX_PAGE_ITEM_BYTES);
    if (cacheResponse) {
      try {
        await cache.put(key, cacheResponse);
        await pruneCache(cache, MAX_PAGE_ENTRIES);
        await enforceStorageBudget();
      } catch {
        // Keep returning the live page if storage is full or unavailable.
      }
    }
    return response;
  } catch {
    const cached = await cache.match(key);
    if (cached) {
      const cachedAt = Number(cached.headers.get("X-Filmam-Cached-At") || 0);
      if (cachedAt && Date.now() - cachedAt <= CACHE_TTL_MS) return cached;
      await cache.delete(key);
    }
    return new Response("This page has not been opened while online yet.", {
      status: 503,
      headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
    });
  }
}

async function networkFirstAsset(request) {
  const cache = await caches.open(ASSET_CACHE);
  try {
    const response = await fetch(new Request(request, { cache: "no-cache" }));
    if (response.ok || response.type === "opaque") {
      const size = Number(response.headers.get("content-length") || 0);
      if (size <= 8 * 1024 * 1024) {
        try {
          await cache.put(request, response.clone());
          await pruneCache(cache, MAX_ASSETS);
          await enforceStorageBudget();
        } catch {
          // Cache quota failures must not break successful image/font downloads.
        }
      }
    }
    return response;
  } catch {
    const cached = await cache.match(request);
    if (cached) return cached;
    return new Response("", { status: 504, statusText: "Asset unavailable offline" });
  }
}

async function networkOrQueueMutation(request) {
  const url = new URL(request.url);
  if (isAuthOrUploadRequest(url)) {
    if (self.navigator?.onLine === false) {
      return jsonResponse({ success: false, offline: true, message: "This request requires an active connection." }, 503);
    }
    try { return await fetch(request); }
    catch { return jsonResponse({ success: false, offline: true, message: "This request requires an active connection." }, 503); }
  }

  const contentType = request.headers.get("content-type") || "";
  if (!/application\/json/i.test(contentType)) {
    try { return await fetch(request); }
    catch { return jsonResponse({ success: false, offline: true }, 503); }
  }

  if (self.navigator?.onLine !== false) {
    try { return await fetch(request); }
    catch {
      if (self.navigator?.onLine !== false) return jsonResponse({ success: false, offline: true }, 503);
    }
  }

  const isPrivate = requiresUser(url);
  const scope = await getUserScope();
  if (isPrivate && (!scope.startsWith("user-") || scope === "unknown")) {
    return jsonResponse({ success: false, offline: true, message: "Sign in while online before queuing this action." }, 503);
  }

  let body;
  try {
    body = await request.clone().arrayBuffer();
  } catch {
    return jsonResponse({ success: false, offline: true }, 503);
  }
  if (body.byteLength > MAX_QUEUE_BODY_BYTES) {
    return jsonResponse({ success: false, offline: true, message: "This request is too large to queue offline." }, 413);
  }

  try {
    await addToOutbox({
      url: request.url,
      method: request.method,
      headers: Array.from(request.headers.entries()).filter(([name]) => !["authorization", "cookie", "host"].includes(name.toLowerCase())),
      body,
      hasBody: request.body !== null,
      createdAt: Date.now(),
      userScope: isPrivate ? scope : null,
      private: isPrivate,
    });
    await requestBackgroundSync();
    return jsonResponse({ success: true, queued: true, message: "Saved and queued for delivery when online." }, 200);
  } catch {
    return jsonResponse({ success: false, offline: true, message: "Could not save this request for later." }, 507);
  }
}

async function addToOutbox(item) {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction("outbox", "readwrite");
    const store = transaction.objectStore("outbox");
    const countRequest = store.count();
    countRequest.onsuccess = () => {
      if (countRequest.result >= MAX_QUEUE_ITEMS) {
        transaction.abort();
        return;
      }
      store.add(item);
    };
    transaction.oncomplete = () => { database.close(); resolve(); };
    transaction.onerror = () => { database.close(); reject(transaction.error); };
    transaction.onabort = () => { database.close(); reject(new Error("Offline queue is full.")); };
  });
}

async function getOutboxItems() {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction("outbox", "readonly");
    const request = transaction.objectStore("outbox").getAll();
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => database.close();
  });
}

async function deleteOutboxItem(id) {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction("outbox", "readwrite");
    transaction.objectStore("outbox").delete(id);
    transaction.oncomplete = () => { database.close(); resolve(); };
    transaction.onerror = () => { database.close(); reject(transaction.error); };
  });
}

async function requestBackgroundSync() {
  try {
    const registration = await self.registration;
    await registration.sync?.register(SYNC_TAG);
  } catch {
    // Browsers without Background Sync will drain the outbox on their next online event.
  }
}

async function getVerifiedUserScope() {
  let response;
  try {
    response = await fetch("/api/auth/me", { credentials: "include", cache: "no-store" });
    if (response.status === 401) {
      const refresh = await fetch("/api/auth/refresh", { method: "POST", credentials: "include", cache: "no-store" });
      if (!refresh.ok) return null;
      response = await fetch("/api/auth/me", { credentials: "include", cache: "no-store" });
    }
    if (!response.ok) return null;
    const user = await response.json();
    return user?.id == null ? null : `user-${String(user.id)}`;
  } catch {
    return null;
  }
}

async function flushOutbox() {
  const items = await getOutboxItems().catch(() => []);
  if (!items.length) return;
  let scope = await getUserScope();
  if (items.some((item) => item.private && item.userScope === scope)) {
    const verifiedScope = await getVerifiedUserScope();
    if (verifiedScope) {
      scope = verifiedScope;
      activeUserScope = scope;
      await setMeta("userScope", scope);
    }
  }

  for (const item of items.sort((left, right) => left.createdAt - right.createdAt)) {
    if (item.private && (!scope.startsWith("user-") || item.userScope !== scope)) continue;

    try {
      const response = await fetch(item.url, {
        method: item.method,
        headers: new Headers(item.headers),
        body: item.hasBody ? item.body : undefined,
        credentials: "include",
        cache: "no-store",
      });

      if (response.status === 401 || response.status >= 500) break;
      await deleteOutboxItem(item.id);
    } catch {
      break;
    }
  }
}

self.addEventListener("push", (event) => {
  if (!event.data) return;
  const data = event.data.json();
  event.waitUntil(self.registration.showNotification(data.title || "فیلمام", {
    body: data.body || "اعلان جدید",
    icon: data.icon || "/icons/filmam-pwa.svg",
    badge: data.badge || "/icons/filmam-pwa.svg",
    data: { url: data.url || "/" },
  }));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const urlToOpen = new URL(event.notification.data?.url || "/", self.location.origin).href;
  event.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
    for (const client of windowClients) {
      if (client.url === urlToOpen && "focus" in client) return client.focus();
    }
    if (self.clients.openWindow) return self.clients.openWindow(urlToOpen);
  }));
});
