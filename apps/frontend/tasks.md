Please migrate the authentication flow to HttpOnly cookie-based authentication.

Requirements:

1. Backend
- Change the JWT access-token strategy to extract the access token from request.cookies.accessToken.
- Change the refresh-token flow to extract the refresh token from request.cookies.refreshToken.
- Do not return accessToken or refreshToken in the JSON response body.
- On login, signup verification, refresh, etc., set the tokens using Set-Cookie with HttpOnly, Secure (in production), appropriate SameSite, and proper expiration/maxAge.
- Keep the existing Bearer-token support temporarily if needed for backward compatibility with the current admin panel, but make cookie authentication the primary/final approach.
- Make sure logout clears the authentication cookies.

2. Admin panel
- Migrate API calls from manually reading cookies and sending Authorization: Bearer ... to credentials: "include".
- Remove client-side access to HttpOnly authentication cookies.
- Make sure login, refresh, logout, and authenticated requests still work correctly.
- Test the complete authentication flow.

3. Main frontend
Create two fetch wrappers:

clientCall:
- Intended for Client Components.
- Use credentials: "include".
- Do not read accessToken or refreshToken from document.cookie.
- The browser must automatically send the HttpOnly cookies.

serverCall:
- Intended for Server Components/server-side code.
- Read the incoming request cookies using Next.js cookies() from next/headers.
- Forward the cookies to the backend using:
  headers: {
    Cookie: cookieHeader,
  }

4. Server-side Set-Cookie handling
- If a server-side request goes through a Next.js Server Component and the backend returns Set-Cookie, do not assume the browser will automatically receive it.
- For server-side operations that need to update browser cookies (especially refresh/login/logout), use a Next.js Route Handler or Server Action as the boundary.
- The Route Handler/Server Action must forward the incoming cookies to the backend and forward the backend's Set-Cookie headers back to the browser.
- Do not introduce a Route Handler for normal server-side GET requests that only need to read cookies.

5. Authentication flow
The desired architecture is:

Client:
Browser
→ clientCall()
→ credentials: "include"
→ Backend
→ Backend reads request.cookies

Server:
Server Component
→ serverCall()
→ Next.js cookies()
→ Cookie header
→ Backend
→ Backend reads request.cookies

For server-side mutations that update authentication cookies:
Client
→ Next.js Route Handler/Server Action
→ Backend
→ Set-Cookie
→ Next.js forwards Set-Cookie
→ Browser

6. Security
- Authentication tokens must be HttpOnly.
- Never expose accessToken or refreshToken to client-side JavaScript.
- Do not store authentication tokens in localStorage/sessionStorage.
- Do not log authentication cookies or tokens.
- Configure CORS correctly for credentialed requests.
- Review SameSite/Secure/Domain configuration for both development and production.
- Review CSRF protection for state-changing requests because authentication is now cookie-based.

7. Testing
Please actually test:
- Login
- Signup verification
- Authenticated client-side request
- Authenticated server-side request
- Access-token expiration
- Refresh-token flow
- Refresh from client
- Refresh when a server-side request requires it
- Logout
- Cookie expiration/clearing
- Admin panel authentication

Do not just change the code. Inspect the existing implementation first, preserve existing behavior where appropriate, and report any architectural issues or edge cases you find.