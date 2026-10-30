# LearnTrace — Personal Learning Workspace

LearnTrace is a **frontend-focused React project** for capturing lecture moments, keeping code examples with explanations, and tracking topics that need revision. It is designed as a medium-level project that can be explained clearly during an evaluation.

## What it can do

- **Dashboard:** overview of bookmarks, code entries, understood concepts, and recent activity.
- **Learning bookmarks:** save a topic, lecture timestamp, source, personal note, and understanding status.
- **Code journal:** save code in common languages, add an explanation and tags, and copy the code.
- **Notes & questions:** write topic notes and pin important items.
- **Search:** filter visible content across the workspace; press **Ctrl + K** to focus search and use the clear button to reset it.
- **Light/dark theme:** switch appearance; the choice is remembered in this browser.
- **Local persistence:** workspace content is saved to browser `localStorage`.
- **Backup and restore:** export a JSON backup and import a LearnTrace workspace backup.
- **Responsive layout:** sidebar and content adapt to smaller screens.
- **Safer actions:** deleting an item asks for confirmation; forms validate required fields.

## Technology used

- React 18 and JavaScript (ES modules)
- Vite development server and production bundler
- HTML and CSS
- Lucide React icons
- Vitest and React Testing Library for automated tests

**Scope note:** this version does not use Spring Boot, MySQL, user accounts, or cloud sync. Data stays in the browser profile on the current device. It does not detect or record a frozen live lecture automatically; the learner adds a bookmark manually.

## Requirements

Install Node.js 20.19+ or 22.12+ (recommended) and npm. Confirm installation:

```bash
node --version
npm --version
```

## Run the project

1. Extract the ZIP file.
2. Open the `LearnTrace` folder in VS Code. Make sure the terminal is inside the folder containing `package.json`.
3. Install project dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm run dev
```

5. Open the local URL printed in the terminal, usually `http://localhost:5173`.

Stop the server with **Ctrl + C** in the terminal. A browser refresh should load the page once and then leave it usable; it should not refresh repeatedly.

## Test and production build

```bash
npm test
npm run build
npm run preview
```

- `npm test` runs the automated test suite.
- `npm run build` creates the production files in `dist/`.
- `npm run preview` serves the production build locally after a successful build.

## Understand the main files

| File | Purpose |
|---|---|
| `src/main.jsx` | Entry point; mounts the React application. |
| `src/App.jsx` | Main screen, page navigation, forms, search, theme, and user actions. |
| `src/styles.css` | Layout, component styling, responsive behavior, and light/dark themes. |
| `src/seed.js` | Sample content shown on the first launch. |
| `src/storage.js` | Small helper functions for reading and writing browser storage. |
| `src/App.test.jsx` | Tests for visible features and user interactions. |
| `src/storage.test.js` | Tests for the storage helper. |
| `vite.config.js` | Vite and Vitest configuration. |

## How the app works

1. React loads sample content from `seed.js` if there is no saved workspace.
2. `App.jsx` stores the current workspace in React state.
3. When the workspace changes, `storage.js` saves it to `localStorage`.
4. When the app opens again, the saved workspace is loaded first.
5. The theme uses a separate local-storage key, so changing appearance does not alter learning records.
6. Search filters the records currently shown. It does not delete or change stored records.

## If the page keeps refreshing

The application source contains no intentional `location.reload()` loop. To diagnose repeated reloads:

1. Stop Vite with **Ctrl + C**.
2. Start it again using `npm run dev` from the folder containing `package.json`.
3. Open the exact local URL printed by Vite.
4. If it still repeats, open browser DevTools (**F12**) and inspect **Console** and **Network** for errors or repeated document requests.
5. If the project is inside a cloud-synced folder such as OneDrive, try moving a copy to a normal local folder (for example `C:\Projects\LearnTrace`) and run it there. File-sync tools can sometimes trigger development-server file events.

Do not assume a CSS/theme change alone will fix a reload loop. The Console and Network evidence are needed to identify the cause.

## Known limitations

- No server, database, authentication, encryption-at-rest, or cloud synchronisation.
- Lecture timestamps are entered manually; there is no live lecture integration.
- Goals are simple progress counters, not reminders or calendar events.
- Importing a backup replaces the current workspace; export a backup first if you need to preserve it.

## Suggested presentation summary

> LearnTrace is a React-based personal learning workspace. It helps learners save lecture timestamps, code examples, and revision notes. React state manages the interface, localStorage preserves data between visits, and CSS supports responsive light and dark themes. The project demonstrates reusable UI patterns, forms, validation, filtering, browser storage, JSON backup, and basic automated testing.

## Verification status

The ZIP is packaged without `node_modules` so it is smaller and portable. Dependencies must be installed on the target machine with `npm install`. Build and test results should be considered **unverified until `npm test` and `npm run build` complete successfully on that machine**.
