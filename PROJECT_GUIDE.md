# LearnTrace — quick code guide

Use this guide to explain the project without memorising every line.

## The simple architecture

```text
main.jsx
  └── App.jsx                 Main state and actions
       ├── WorkspaceViews.jsx Dashboard and content screens/forms
       ├── storage.js          Save/load workspace in localStorage
       └── seed.js             Example starter content

styles.css                    Appearance and responsive layout
App.test.jsx                  UI behavior tests
storage.test.js               Storage helper tests
```

## The most important concepts

### 1. React state

`useState` stores values that can change while the app is running. Examples include the active page, search text, current workspace, selected theme, and whether a form is open. Calling a state setter tells React to render the UI again with the new value.

### 2. Reusable components

`WorkspaceViews.jsx` contains the dashboard and content views. `App.jsx` coordinates them and passes values/functions as props. This keeps the main app logic separate from the presentation of each screen.

### 3. Saving data

`storage.js` wraps `localStorage`. The workspace is converted to JSON before saving and parsed from JSON when loading. `localStorage` is browser-only storage: it survives a page refresh but is not a database and does not sync to another device.

### 4. Search

The search input updates the `search` state. Each page filters its own list by comparing the search text with the fields relevant to that type of record. Searching does not modify or delete the original data.

### 5. Light/dark theme

The theme is held in React state and saved under `learntrace:theme`. The root element receives `data-theme="light"` or `data-theme="dark"`; CSS rules change the colors based on that attribute.

### 6. Form validation

`CreateModal` checks required fields before calling the save callback. A bookmark timestamp must use a format such as `00:42:18`. If validation fails, an error message is shown and the record is not saved.

### 7. Automated tests

`App.test.jsx` renders the application and simulates user actions, such as navigating to a page, creating a bookmark, validating a timestamp, switching themes, and clearing search. A test is a repeatable check; it does not replace manually opening the app in a browser.

## Suggested evaluation explanation

> I built LearnTrace using React, JavaScript, HTML, and CSS. It helps learners save lecture timestamps, code snippets, and revision notes. I use React state to control the interface, reusable components to separate screens, localStorage to preserve data in the browser, and CSS themes for light and dark mode. The project also includes search, form validation, JSON backup/restore, and automated tests.

## Limitations to state honestly

- No Spring Boot backend or MySQL database is connected.
- Records remain in one browser profile on one device.
- Lecture timestamps are entered manually; the app does not monitor a live lecture.
- Build and test commands should be run after installing dependencies on the computer where the project will be evaluated.
