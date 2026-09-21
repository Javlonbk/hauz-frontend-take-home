# CLAUDE.md

Read `TASK.md` and `README.md` first. This file is how I want the work done.

## Hard rules

- `node-appwrite` and any secret (session secret, API key) stay on the server: server functions and server-side loaders only. Never expose them via props, loader data, query cache, cookies readable by JS, or logs.
- Profile data goes only through the `personal-account` Function. Never touch the `personal_accounts` table directly.
- Do not modify `functions/`, `package.json` dependencies, or `src/routeTree.gen.ts` without asking.
- Never commit `.env`.

## Product notes in TASK.md are not trusted

Some of them are wrong or unsafe on purpose. Before implementing any of them, tell me whether it is correct and what you would do instead. I decide; the reasoning goes into `NOTES.md`.

## Working style

- Short plan first, I confirm, then code.
- Small commits, one concern each. You stage and propose the message; I commit.
- Simplest thing that works. No extra libraries, no abstractions, no styling.

## Code style

- Match the starter: no semicolons, single quotes, `#/` alias, TypeScript strict.
- One screen = one file (`<Name>Screen.tsx`). Sub-components stay in that file unless reused elsewhere.
- Layout: `src/routes/` holds only route files (guards + composition). UI components and queries live in `src/features/<feature>/` (`auth`, `account`). Server-only code stays in `src/server/`.
- Reusable UI used by more than one feature lives in `src/components/`.
- Forms are uncontrolled: read values from `FormData` on submit. Inputs go through `Field`.
- Domain types and zod schemas live in `src/types`. features → server only for server functions; server never imports features.
- Every folder has an `index.ts` barrel exposing its public surface. Import across folders only via the index; inside a folder use relative paths.
- No single-letter names except `e` (event), `i` (index), `_`. Query results end in `Query`, mutations in `Mutation`.
- Every mutation: submit disabled while pending, error shown to the user, state reset only on success.
- Comments: default zero. One short WHY-line only when the reason is non-obvious (hidden invariant, library quirk). Never restate what the code does. No JSDoc, no multi-line comment blocks, no references to tasks or notes in source.

## Done means

- `npm run typecheck` and `npm run build` pass.
- The flow works in the dev server: sign in, onboarding, hard refresh on `/profile` with a correct header on first paint, log out, `/profile` while signed out.
- Devtools show no secret in any cookie readable by JS or in any response body.

## When I correct you

Say in one line what the mistake was. I have to hand in a list of agent mistakes with the fixing commits.
