# Notes

## How it is built

- Everything Appwrite happens in server functions. The session secret lives in an `HttpOnly` cookie set by the server; the browser never sees it or the API key. The client bundle contains no `node-appwrite`.
- The Function is executed with the caller's session, not the API key. An API-key execution has no `x-appwrite-user-id`, so the Function would answer 401. The `execution.write` key scope from the README is unused.
- One Function `GET` per request resolves the viewer: Appwrite 401 = signed out, Function 404 = signed in without an account, 200 = onboarded. The root route loads it in `beforeLoad`, so the header is server-rendered correctly on a hard refresh.

## Product notes, one by one

- **Role cannot be changed.** Followed. The Function's `PATCH` has no `role`; the profile shows it read-only.
- **Send people to whatever `redirect` names.** Not as written: that is an open redirect. Only a same-origin path (starts with a single `/`) is honoured; anything else falls back to `/`. Onboarding, when needed, happens before the redirect.
- **Clearing contact email or bio must remove it.** Followed, but an empty string is not enough: the Function rejects `""` and treats an omitted field as "keep". The form sends `null` for an emptied optional field.
- **Send the user's id with profile changes.** Not followed. The Function takes identity only from the `x-appwrite-user-id` header that Appwrite injects from the session. A user id in the body is ignored today and would be an IDOR if it were honoured. Identity is the cookie.
- **Double-clicking Continue must never create two accounts.** Followed. The button is disabled while the request is pending, and the Function's unique index plus its 200-on-retry handles anything that slips through.
- **Any failure loading the user means signed out; delete the cookie.** Only for an Appwrite 401. A network error, a 5xx or a failing Function says nothing about the session; deleting the cookie there would log everyone out during a blip. Those errors surface instead.

## Agent mistakes I caught

- Log out cleared the cookie only after Appwrite's `deleteSession` succeeded, so a failed call left the user signed in. Fixed in [1a80767](https://github.com/Javlonbk/hauz-frontend-take-home/commit/1a80767).
- Log out invalidated the viewer query before leaving the page, so the current page re-rendered with a null viewer. Fixed in [1a80767](https://github.com/Javlonbk/hauz-frontend-take-home/commit/1a80767).
- `NOTES.md` was asked for in the onboarding commit and only written two commits later, in the commit that adds this file.

## Next for production

- Map an expired session mid-form to "Sign in again" instead of Appwrite's raw 401 text.
- Rate-limit code requests per email on our side; resend and change-email controls on the code step.
- Show the sign-in email on the profile so it is clear contact email is a separate, public address.
