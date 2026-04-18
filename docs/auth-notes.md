# Tiledesk Dashboard — Authentication Notes

Angular SPA authentication: how login starts, which server endpoints are used, and how tokens are stored. Server-side validation and project roles are implemented in **tiledesk-server** (see `tiledesk-server/docs/auth-flow.md`).

## Where login starts

| Item | Location |
|------|----------|
| Route | `path: 'login'` lazy-loads `app/auth/signin/signin.module` — `src/app/app.routing.ts` |
| Sign-in UI | `src/app/auth/signin/signin.component.ts` — form submit calls `AuthService.signin(...)` |
| Autologin / token in URL | `src/app/auth/autologin/autologin.component.ts` — route `autologin/:route/:token` in `app.routing.ts` |
| Navigation guard | `src/app/core/auth.guard.ts` — restricts routes based on stored user / app rules |

## AuthService (central client logic)

**File:** `src/app/core/auth.service.ts`

- Builds API base URLs from `AppConfigService.getConfig()` (from `environment` and/or loaded `dashboard-config.json`).
- **Sign-in URL:** `{baseUrl}auth/signin` — `POST` with JSON `{ email, password }`.
- **Signup:** `{SERVER_BASE_URL}auth/signup`
- **Verify email:** `{SERVER_BASE_URL}auth/verifyemail/...`
- **Google:** `window` navigation to `{SERVER_BASE_PATH}auth/google` (optional query params for redirect).
- **OAuth2:** `window` navigation to `{SERVER_BASE_PATH}auth/oauth2` — `signinWithOAuth2()`.

After successful sign-in:

- Token attached to user object: `user.token` (value includes `JWT ` prefix as returned by server).
- **localStorage:** `user` (JSON), `tiledesk_token` (for chat / Ionic autologin).

If `firebaseAuth` is true in config, the service calls **`POST chat21/firebase/auth/createCustomToken`** with `Authorization: <JWT>` then `firebase.auth().signInWithCustomToken(...)` for FCM / Firebase features.

## Configuration

| Source | Purpose |
|--------|---------|
| `src/environments/environment.ts` (and `.prod.ts`, `.pre.ts`) | Defaults: `remoteConfigUrl`, `SERVER_BASE_URL`, `firebaseAuth`, `firebase`, feature flags |
| `src/dashboard-config.json` (or template + deploy-time `envsubst`) | Runtime overrides when `remoteConfig: true` — see `angular.json` assets |
| `src/app/services/app-config.service.ts` | Loads remote config via raw `HttpClient` (bypasses interceptors) |

**OAuth2 button visibility:** `signin.component.ts` reads `oauth2SigninEnabled` from `AppConfigService.getConfig()` (must be set in environment or dashboard config).

## HTTP authorization

There is no global auth HTTP interceptor that injects JWT for all requests; services typically read the current user / token and set `Authorization` where needed (e.g. websocket and widget-related services). Token source is usually **localStorage** `user` or `AuthService` / `UsersService` state.

## Relation to Microsoft Entra ID

The dashboard does **not** talk to Entra directly today. Entra integration is expected to use the **server OAuth2 redirect** (`GET .../auth/oauth2`), then the user returns to the dashboard with a **Tiledesk JWT** in the query string (same pattern as Google). Ensure:

- `SERVER_BASE_URL` points to the API that exposes `/auth/oauth2`.
- `oauth2SigninEnabled` is true if the product should show the OAuth2 sign-in button.

**Risk (server-side, affects UX):** If the API has **`DISABLE_SESSION_STRATEGY=true`**, OAuth redirect targets stored in **session** may not work; see `tiledesk-server/docs/entra-integration-plan.md`.

## Key file index

| Area | Path |
|------|------|
| Auth service | `src/app/core/auth.service.ts` |
| Auth guard | `src/app/core/auth.guard.ts` |
| Sign-in | `src/app/auth/signin/signin.component.ts` |
| Autologin | `src/app/auth/autologin/autologin.component.ts` |
| App routing | `src/app/app.routing.ts` |
| App config load | `src/app/services/app-config.service.ts` |
| Environments | `src/environments/environment*.ts` |

Further deployment env mapping: **`tiledesk/docs/auth-env-notes.md`**.
