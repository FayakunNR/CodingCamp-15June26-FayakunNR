# Implementation Plan: To-Do List Life Dashboard

## Overview

Implement a single-page life dashboard using pure HTML, CSS, and Vanilla JavaScript. The file structure is strictly `index.html`, `css/style.css`, and `js/app.js`. Tasks are ordered so each step builds on the previous, starting with the scaffold and ending with a final polish pass. All logic lives in `app.js` as `init*` functions; no external libraries are used.

## Tasks

- [x] 1. Project scaffold — create base files and shared structure
  - Create `index.html` with `<!DOCTYPE html>`, `<meta charset>`, `<meta name="viewport">`, a `<link>` to `css/style.css`, a `<script defer src="js/app.js">`, and a `<main id="dashboard">` wrapper containing four empty `<section>` placeholders with ids: `greeting-widget`, `timer-widget`, `todo-widget`, `links-widget`
  - Create `css/style.css` with CSS custom properties (`--color-bg`, `--color-surface`, `--color-accent`, `--color-highlight`, `--color-text`, `--color-muted`, `--space-sm`, `--space-md`, `--space-lg`, `--radius-md`), a CSS Grid dashboard layout (`grid-template-columns: 1fr 1fr`), widget card styles (background, padding, border-radius), and a `@media (max-width: 680px)` single-column breakpoint
  - Create `js/app.js` with a `DOMContentLoaded` listener that calls four stub functions: `initGreeting()`, `initTimer()`, `initTodo()`, `initQuickLinks()` — each defined as empty functions initially
  - _Requirements: 13.1, 13.2, 13.3_

- [x] 2. Greeting Section — HTML, CSS, and JS
  - [x] 2.1 Add Greeting Section HTML and CSS
    - Inside `#greeting-widget` add: `<h1 id="greeting-text">`, `<p id="greeting-time">`, `<p id="greeting-date">`
    - Style the greeting widget: large `greeting-text` font, muted `greeting-date` and `greeting-time` styling using custom properties
    - _Requirements: 1.1, 1.2, 2.1, 2.2, 2.3, 2.4_

  - [x] 2.2 Implement greeting logic in `app.js`
    - Write `getGreetingText(hour)`: return "Good Morning" for hours 5–11, "Good Afternoon" for 12–17, "Good Evening" for 0–4 and 18–23
    - Write `formatTime(date)`: return 12-hour HH:MM AM/PM string from a `Date` object
    - Write `formatDate(date)`: return "Weekday, Month DD" string (e.g. "Monday, June 16")
    - Write `renderGreeting()`: read `new Date()`, set `textContent` of `#greeting-text`, `#greeting-time`, `#greeting-date`
    - Implement `initGreeting()`: call `renderGreeting()` once, then `setInterval(renderGreeting, 60000)`
    - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 2.3, 2.4_

  - [ ]* 2.3 Write property test for greeting hour coverage
    - **Property 1: Greeting covers all hours**
    - **Validates: Requirements 2.1, 2.2, 2.3, 2.4**
    - Use `console.assert` in a dev-only block: iterate hours 0–23, assert `getGreetingText(h)` returns one of the three expected strings and is never empty/undefined

  - [ ]* 2.4 Write property test for time display format
    - **Property 2: Timer display format invariant** (also applies to `formatTime`)
    - **Validates: Requirements 1.1, 3.1, 3.3**
    - Assert `formatTime(new Date())` matches `/^\d{1,2}:\d{2} (AM|PM)$/`

- [x] 3. Checkpoint — verify greeting section
  - Open `index.html` in a browser; confirm time, date, and greeting text all display correctly at the current hour. Ensure all `console.assert` tests pass. Ask the user if questions arise.

- [x] 4. Focus Timer — HTML, CSS, and JS
  - [x] 4.1 Add Focus Timer HTML and CSS
    - Inside `#timer-widget` add: `<div id="timer-display">25:00</div>` and a `<div id="timer-controls">` containing `<button id="btn-start">Start</button>`, `<button id="btn-stop" disabled>Stop</button>`, `<button id="btn-reset">Reset</button>`
    - Style `#timer-display` using `--timer-font-size` (3rem), monospace font, centered
    - Style control buttons using custom properties; add a visual disabled state (reduced opacity)
    - _Requirements: 3.1, 4.1, 4.2, 4.3_

  - [x] 4.2 Implement timer state machine in `app.js`
    - Define `timerState = { remaining: 1500, status: 'idle', intervalId: null }` in module scope
    - Write `renderTimer(seconds)`: format seconds as `MM:SS` (zero-padded) and set `#timer-display` `textContent`
    - Write `updateTimerControls()`: set `btn-start.disabled = (status === 'running')`, `btn-stop.disabled = (status !== 'running')`
    - Write `tickTimer()`: decrement `remaining`; if `remaining <= 0`, call `resetTimer()` then `notifyTimerEnd()`; else call `renderTimer(remaining)`
    - Write `startTimer()`: set `status = 'running'`, call `updateTimerControls()`, set `intervalId = setInterval(tickTimer, 1000)`
    - Write `stopTimer()`: `clearInterval(intervalId)`, set `status = 'paused'`, call `updateTimerControls()`
    - Write `resetTimer()`: `clearInterval(intervalId)`, set `remaining = 1500`, `status = 'idle'`, call `renderTimer(1500)`, `updateTimerControls()`
    - Write `notifyTimerEnd()`: `alert("Time's up! Great work.")`
    - Implement `initTimer()`: call `renderTimer(1500)`, `updateTimerControls()`, bind click events on Start/Stop/Reset to `startTimer`/`stopTimer`/`resetTimer`
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 4.1, 4.2, 4.3, 4.4, 4.5_

  - [ ]* 4.3 Write property test for timer display format
    - **Property 2: Timer display format invariant**
    - **Validates: Requirements 3.1, 3.3**
    - `console.assert` loop: for every integer `s` in [0, 1500], assert `renderTimer(s)` result matches `/^\d{2}:\d{2}$/`

  - [ ]* 4.4 Write property test for timer controls state machine
    - **Property 7: Timer state machine control consistency**
    - **Validates: Requirements 4.4, 4.5**
    - For each of `'idle'`, `'running'`, `'paused'`: set `timerState.status`, call `updateTimerControls()`, assert Start and Stop disabled attributes match the expected state machine table

- [x] 5. Checkpoint — verify Focus Timer
  - Click Start → counter counts down. Click Stop → pauses. Click Reset → returns to 25:00. Start button is disabled while running; Stop is disabled while idle/paused. All `console.assert` property tests pass. Ask the user if questions arise.

- [x] 6. To-Do List — HTML, CSS, and JS
  - [x] 6.1 Add To-Do Widget HTML and CSS
    - Inside `#todo-widget` add: `<form id="add-task-form">` with `<input id="task-input" type="text" placeholder="Add a task…" autocomplete="off">` and `<button type="submit">Add</button>`, followed by `<ul id="task-list"></ul>`
    - Style the form as a flex row; style `#task-list` items as flex rows with a toggle, description span, edit button, and delete button
    - Style completed tasks: `.task-completed .task-description { text-decoration: line-through; color: var(--color-muted); }`
    - _Requirements: 5.1, 5.2, 5.3, 7.2_

  - [x] 6.2 Implement localStorage helpers for tasks
    - Write `loadTasks()`: `JSON.parse(localStorage.getItem('tasks'))` inside `try/catch`; return `[]` on error or null
    - Write `saveTasks(tasks)`: `localStorage.setItem('tasks', JSON.stringify(tasks))` inside `try/catch`; return `true` on success, `false` on failure
    - _Requirements: 5.4, 6.4, 7.3, 8.2, 9.1, 9.2_

  - [ ]* 6.3 Write property test for task persistence round-trip
    - **Property 3: Task persistence round-trip**
    - **Validates: Requirements 5.4, 6.4, 7.3, 8.2, 9.1**
    - Build several Task arrays of varied length; call `saveTasks(tasks)` then `loadTasks()`; assert resulting array deeply equals the original

  - [x] 6.4 Implement task CRUD and rendering
    - Write `validateDescription(str)`: return `str.trim().length > 0`
    - Write `createTask(description)`: return `{ id: Date.now().toString(), description: description.trim(), completed: false }`
    - Write `renderTaskList(tasks)`: rebuild `#task-list` innerHTML using a `map` over tasks; each `<li data-id>` contains toggle button (`data-action="toggle"`), `.task-description` span, edit button (`data-action="edit"`), delete button (`data-action="delete"`); add `task-completed` class when `task.completed === true`; set `#task-list` innerHTML to the joined result
    - Write `addTask(description)`: validate → push `createTask(description)` to array → `saveTasks` → `renderTaskList` → clear input
    - Write `deleteTask(id)`: snapshot array → splice → `saveTasks`; if `saveTasks` returns `false`, restore snapshot → re-render
    - Write `toggleTask(id)`: flip `completed` → `saveTasks` → re-render (no revert on failure per Requirement 7.4)
    - Write `startEditTask(id)`: replace the task's `<span>` with `<input>` pre-populated with description, and swap edit/delete buttons for save (`data-action="save"`) and cancel (`data-action="cancel"`) buttons
    - Write `confirmEditTask(id, value)`: validate → update description → `saveTasks`; if `saveTasks` returns `false`, revert description → re-render
    - Write `cancelEditTask()`: re-render current task list without changes
    - Attach a single `click` event listener on `#task-list` using `event.target.dataset.action` to dispatch to `deleteTask`, `toggleTask`, `startEditTask`, `confirmEditTask`, `cancelEditTask`
    - Implement `initTodo()`: load tasks, render, bind `#add-task-form` submit (prevent default, call `addTask`)
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 6.1, 6.2, 6.3, 6.4, 6.5, 7.1, 7.3, 7.4, 8.1, 8.2, 8.3, 9.1, 9.2_

  - [ ]* 6.5 Write property test for whitespace task rejection
    - **Property 4: Whitespace task rejection**
    - **Validates: Requirements 5.3, 6.3**
    - Assert `validateDescription("")`, `validateDescription("   ")`, `validateDescription("\t\n")` all return `false`

  - [ ]* 6.6 Write property test for task toggle idempotence
    - **Property 8: Task toggle idempotence-pair**
    - **Validates: Requirements 7.1, 7.3**
    - Create a sample task, call `toggleTask` twice, assert `completed` equals the original value

- [x] 7. Checkpoint — verify To-Do List
  - Add tasks, mark complete, edit, delete; reload page and confirm tasks persist. Whitespace-only input is rejected. Edit → cancel restores original. All `console.assert` tests pass. Ask the user if questions arise.

- [x] 8. Quick Links — HTML, CSS, and JS
  - [x] 8.1 Add Quick Links Widget HTML and CSS
    - Inside `#links-widget` add: `<form id="add-link-form">` with `<input id="link-label" type="text" placeholder="Label">`, `<input id="link-url" type="url" placeholder="https://…">`, `<button type="submit">Add</button>`, followed by `<div id="link-list"></div>`
    - Style link items as flex rows: `<a>` styled as a button/pill and a delete button (`data-action="delete"`)
    - _Requirements: 10.1, 11.1, 11.4_

  - [x] 8.2 Implement localStorage helpers for links
    - Write `loadLinks()`: `JSON.parse(localStorage.getItem('quickLinks'))` inside `try/catch`; return `[]` on error or null
    - Write `saveLinks(links)`: `localStorage.setItem('quickLinks', JSON.stringify(links))` inside `try/catch`; return `true`/`false`
    - _Requirements: 10.1, 11.3, 12.2_

  - [ ]* 8.3 Write property test for Quick Link persistence round-trip
    - **Property 5: Quick Link persistence round-trip**
    - **Validates: Requirements 10.1, 11.3, 12.2**
    - Build several QuickLink arrays; `saveLinks` then `loadLinks`; assert deep equality

  - [x] 8.4 Implement Quick Links CRUD and rendering
    - Write `validateLink(label, url)`: return `label.trim().length > 0 && url.trim().length > 0`
    - Write `createLink(label, url)`: return `{ id: Date.now().toString(), label: label.trim(), url: url.trim() }`
    - Write `renderLinks(links)`: rebuild `#link-list` innerHTML; each `.link-item` contains `<a href target="_blank" rel="noopener">` with label text and a `<button data-action="delete" data-id>✕</button>`
    - Write `addLink(label, url)`: validate → push `createLink` → `saveLinks` → `renderLinks` → clear inputs
    - Write `deleteLink(id)`: splice → `saveLinks` → `renderLinks`
    - Attach a `click` event listener on `#link-list` dispatching `deleteLink` when `data-action === 'delete'`
    - Implement `initQuickLinks()`: load links, render, bind `#add-link-form` submit
    - _Requirements: 10.1, 10.2, 10.3, 11.1, 11.2, 11.3, 11.4, 12.1, 12.2_

  - [ ]* 8.5 Write property test for Quick Link validation
    - **Property 6: Quick Link validation rejects empty fields**
    - **Validates: Requirements 11.2**
    - Assert `validateLink("", "https://x.com")`, `validateLink("GitHub", "")`, `validateLink("", "")` all return `false`

- [x] 9. Checkpoint — verify Quick Links
  - Add links, click to open in new tab, delete links; reload and confirm persistence. Empty label or URL is rejected. All `console.assert` tests pass. Ask the user if questions arise.

- [x] 10. Polish and cross-browser final check
  - [x] 10.1 Visual polish
    - Audit spacing, font sizes, and button styles across all four widgets; adjust CSS custom properties for consistent look and feel
    - Add hover and focus styles to all interactive elements (buttons, inputs, links) for accessibility
    - Ensure the dashboard grid layout looks correct at both desktop (≥ 680px) and mobile (< 680px) widths
    - Verify `rel="noopener"` is present on all Quick Link `<a>` elements
    - Verify all dynamic content is written via `textContent` (not `innerHTML`) to prevent XSS
    - _Requirements: 7.2, 10.2, 13.5_

  - [x] 10.2 Cross-browser verification
    - Open `index.html` in Chrome, Firefox, Edge, and Safari; confirm all four widgets render and function correctly
    - Verify localStorage read/write works in each browser
    - Confirm no console errors appear on load or during interaction
    - _Requirements: 13.5_

- [x] 11. Final checkpoint — full integration
  - Perform a full end-to-end walkthrough: check greeting at different hours, run timer to completion (or near it), add/edit/complete/delete tasks, add/delete quick links, reload and verify persistence. Remove or gate all `console.assert` dev-only test blocks. Ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional property/unit tests — skip for a faster MVP, but they catch regressions
- `console.assert` test blocks should be wrapped in a `if (location.hostname === 'localhost')` guard or similar so they don't run in production
- `crypto.randomUUID()` is widely supported in modern browsers; fall back to `Date.now().toString()` if needed for older Safari
- All correctness properties are defined in `design.md` — each `*` test task references the relevant property and requirement numbers

## Task Dependency Graph

```json
{
  "waves": [
    { "wave": 1, "tasks": ["1"] },
    { "wave": 2, "tasks": ["2"] },
    { "wave": 3, "tasks": ["3"] },
    { "wave": 4, "tasks": ["4"] },
    { "wave": 5, "tasks": ["5"] },
    { "wave": 6, "tasks": ["6"] },
    { "wave": 7, "tasks": ["7"] },
    { "wave": 8, "tasks": ["8"] },
    { "wave": 9, "tasks": ["9"] },
    { "wave": 10, "tasks": ["10"] },
    { "wave": 11, "tasks": ["11"] }
  ]
}
```
