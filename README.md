# Spots - Final Project Project/ 9 final version ready for review

This repository is the Spots project updated to integrate with TripleTen backend API.

## What I changed

- Added `scripts/Api.js` for server requests (GET/POST/PATCH/DELETE/PUT).
- Replaced static initial cards with server-provided cards via `Promise.all`.
- Added delete confirmation modal and implemented delete flow.
- Implemented like/unlike behavior using API endpoints.
- Added avatar edit modal and integration (`PATCH /users/me/avatar`).
- Added simple UX indicators: "Saving..." and "Deleting...".
- Added `scripts/constants.compat.js` to store the API token (replace with your token).
- Added `package.json` and `webpack.config.js` templates for bundling (optional).

## How to run (simple static approach)

1. Put your personal token in `scripts/constants.compat.js` replacing `REPLACE_WITH_YOUR_TOKEN`.
2. Open `index.html` in the browser (no build required).

## How to run with webpack (optional)

1. Install dependencies: `npm install`
2. Replace the token in `scripts/constants.compat.js`.
3. Start dev server: `npm start`
4. Build for production: `npm run build` (output to `dist/main.js`)

## Submission notes

- Create a branch `spots-final`, commit your changes, push to GitHub, and open a PR to `main`.
- Include a project pitch video link in the PR description or `README.md`.
- Make sure the token is set so the reviewer can test API interactions.

## Files to review

- `scripts/Api.js`
- `scripts/index.js` (backup: `scripts/index.js.bak`)
- `scripts/constants.compat.js` (replace token)
- `index.html` (contains modals and templates)
