"use client";

import { useEffect } from "react";

export default function PwaServiceWorkerComp({ userId }: { userId: number | null }) {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    const scope = userId == null ? null : String(userId);
    let registration: ServiceWorkerRegistration | undefined;

    const notifyWorker = (flush = false) => {
      const worker = navigator.serviceWorker.controller ?? registration?.active;
      worker?.postMessage({ type: flush ? "CLIENT_ONLINE" : "SET_USER_SCOPE", userId: scope });
    };

    const handleOnline = () => notifyWorker(true);
    const handleControllerChange = () => notifyWorker();

    void navigator.serviceWorker.register("/sw.js", { scope: "/", updateViaCache: "none" }).then(async (result) => {
      registration = result;
      await navigator.serviceWorker.ready;
      notifyWorker(navigator.onLine);
      const syncRegistration = result as ServiceWorkerRegistration & { sync?: { register: (tag: string) => Promise<void> } };
      if (navigator.onLine) {
        try {
          await syncRegistration.sync?.register("filmam-offline-outbox");
        } catch {
          // The online event remains the fallback where Background Sync is unavailable.
        }
      }
    }).catch(() => {
      // PWA enhancements should not block the website if registration is unavailable.
    });

    navigator.serviceWorker.addEventListener("controllerchange", handleControllerChange);
    window.addEventListener("online", handleOnline);
    notifyWorker();

    return () => {
      navigator.serviceWorker.removeEventListener("controllerchange", handleControllerChange);
      window.removeEventListener("online", handleOnline);
    };
  }, [userId]);

  return null;
}
