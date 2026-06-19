# Requirements Document

## Introduction

A personal life dashboard web application delivered as a single-page website using pure HTML, CSS, and Vanilla JavaScript with no external frameworks or backend. The dashboard combines four core productivity widgets: a time-aware greeting section, a Pomodoro-style focus timer, a persistent to-do list, and a quick links launcher. All data is stored exclusively in the browser's Local Storage API, so the app works entirely client-side with no server required.

The file structure is strictly constrained to:
```
index.html
css/
  style.css
js/
  app.js
```

---

## Glossary

- **App**: The To-Do List Life Dashboard single-page web application
- **Dashboard**: The main page (`index.html`) showing all widgets
- **Timer**: The Pomodoro-style focus countdown timer widget
- **Task**: A single to-do item with a description and completion state
- **Task_List**: The ordered collection of Tasks displayed and managed in the to-do widget
- **Quick_Link**: A saved URL/label pair rendered as a clickable button
- **Local_Storage**: The browser's `localStorage` API used to persist all user data
- **Greeting_Section**: The UI widget displaying current time, date, and a time-of-day greeting
- **Focus_Timer**: The UI widget containing the countdown timer and its controls
- **Todo_Widget**: The UI widget for managing the Task_List
- **Quick_Links_Widget**: The UI widget for managing and launching Quick_Links

---

## Requirements

### Requirement 1: Greeting Section — Time and Date Display

**User Story:** As a user, I want to see the current time and date when I open the dashboard, so that I can stay oriented throughout my day without switching tabs.

#### Acceptance Criteria

1. WHEN the Dashboard loads, THE Greeting_Section SHALL display the current local time in HH:MM format (24-hour or 12-hour with AM/PM).
2. WHEN the Dashboard loads, THE Greeting_Section SHALL display the current local date including the day of the week, month, and day number.
3. WHILE the Dashboard is open, THE Greeting_Section SHALL update the displayed time at exactly 60-second intervals.

---

### Requirement 2: Greeting Section — Time-of-Day Greeting

**User Story:** As a user, I want to see a personalized greeting based on the time of day, so that the dashboard feels welcoming and contextually aware.

#### Acceptance Criteria

1. WHILE the local hour is between 05:00 and 11:59 (inclusive), THE Greeting_Section SHALL display "Good Morning".
2. WHILE the local hour is between 12:00 and 17:59 (inclusive), THE Greeting_Section SHALL display "Good Afternoon".
3. WHILE the local hour is between 18:00 and 23:59 (inclusive), THE Greeting_Section SHALL display "Good Evening".
4. WHILE the local hour is between 00:00 and 04:59 (inclusive), THE Greeting_Section SHALL display "Good Evening".

---

### Requirement 3: Focus Timer — Countdown Behavior

**User Story:** As a user, I want a 25-minute countdown timer, so that I can work in focused Pomodoro intervals.

#### Acceptance Criteria

1. WHEN the Dashboard loads, THE Focus_Timer SHALL display a countdown initialized to 25 minutes and 00 seconds (25:00).
2. WHEN the user activates the Start control, THE Focus_Timer SHALL begin counting down by one second per real-world second.
3. WHILE the Focus_Timer is counting down, THE Focus_Timer SHALL update the displayed time every second.
4. WHEN the Focus_Timer countdown reaches 00:00, THE Focus_Timer SHALL stop automatically and notify the user with a browser alert or audible/visual signal.

---

### Requirement 4: Focus Timer — Controls

**User Story:** As a user, I want Start, Stop, and Reset controls for the timer, so that I can manage my focus sessions flexibly.

#### Acceptance Criteria

1. WHEN the user activates the Start control WHILE the Focus_Timer is not running, THE Focus_Timer SHALL begin or resume the countdown.
2. WHEN the user activates the Stop control WHILE the Focus_Timer is running, THE Focus_Timer SHALL pause the countdown without resetting the remaining time.
3. WHEN the user activates the Reset control, THE Focus_Timer SHALL stop any active countdown and restore the display to 25:00.
4. WHILE the Focus_Timer is running, THE Focus_Timer SHALL disable the Start control to prevent duplicate activation.
5. WHILE the Focus_Timer is not running, THE Focus_Timer SHALL disable the Stop control.

---

### Requirement 5: To-Do List — Adding Tasks

**User Story:** As a user, I want to add new tasks to my to-do list, so that I can capture things I need to do.

#### Acceptance Criteria

1. WHEN a user enters a non-empty task description and submits the add-task form (via button click or Enter key), THE Todo_Widget SHALL create a new Task and append it to the Task_List.
2. WHEN a new Task is successfully added, THE Todo_Widget SHALL clear the task input field.
3. IF a user attempts to submit an add-task form with an empty or whitespace-only input, THEN THE Todo_Widget SHALL prevent Task creation, reject the submission, and leave the Task_List unchanged.
4. WHEN a Task is added, THE Todo_Widget SHALL persist the updated Task_List to Local_Storage immediately.

---

### Requirement 6: To-Do List — Editing Tasks

**User Story:** As a user, I want to edit existing tasks, so that I can correct or update task descriptions without deleting and re-adding them.

#### Acceptance Criteria

1. WHEN a user activates the edit control for a Task, THE Todo_Widget SHALL replace the Task's display text with an editable input field pre-populated with the current description.
2. WHEN a user confirms the edit (via save button or Enter key) with a non-empty description, THE Todo_Widget SHALL update the Task's description and return to display mode.
3. IF a user confirms the edit with an empty or whitespace-only description, THEN THE Todo_Widget SHALL reject the change and restore the original description.
4. WHEN a Task description is successfully updated, THE Todo_Widget SHALL persist the updated Task_List to Local_Storage immediately.
5. IF the Local_Storage write fails after a Task description update, THEN THE Todo_Widget SHALL revert the Task's description to its previous value and treat the update as unsuccessful.

---

### Requirement 7: To-Do List — Marking Tasks as Done

**User Story:** As a user, I want to mark tasks as complete, so that I can track my progress.

#### Acceptance Criteria

1. WHEN a user activates the completion toggle for a Task, THE Todo_Widget SHALL toggle the Task's completed state between done and not-done.
2. WHEN a Task is marked as done, THE Todo_Widget SHALL apply a visual distinction (e.g., strikethrough or muted color) to differentiate it from incomplete Tasks.
3. WHEN a Task's completion state changes, THE Todo_Widget SHALL persist the updated Task_List to Local_Storage immediately.
4. IF the Local_Storage write fails after a completion state change, THEN THE Todo_Widget SHALL retain the updated completion state in the UI without reverting.

---

### Requirement 8: To-Do List — Deleting Tasks

**User Story:** As a user, I want to delete tasks, so that I can remove items I no longer need.

#### Acceptance Criteria

1. WHEN a user activates the delete control for a Task, THE Todo_Widget SHALL remove that Task from the Task_List.
2. WHEN a Task is deleted, THE Todo_Widget SHALL persist the updated Task_List to Local_Storage immediately.
3. IF the Local_Storage write fails after a Task deletion, THEN THE Todo_Widget SHALL revert the deletion and restore the Task to the Task_List.

---

### Requirement 9: To-Do List — Persistence

**User Story:** As a user, I want my tasks to survive page reloads, so that I don't lose my list when I close or refresh the browser tab.

#### Acceptance Criteria

1. WHEN the Dashboard loads, THE Todo_Widget SHALL read the Task_List from Local_Storage and render all previously saved Tasks.
2. IF no Task_List data exists in Local_Storage, THEN THE Todo_Widget SHALL render an empty Task_List without errors.

---

### Requirement 10: Quick Links — Displaying and Launching Links

**User Story:** As a user, I want to see my saved websites as clickable buttons, so that I can navigate to them quickly from the dashboard.

#### Acceptance Criteria

1. WHEN the Dashboard loads, THE Quick_Links_Widget SHALL read all saved Quick_Links from Local_Storage and render each one as a labeled button.
2. WHEN a user clicks a Quick_Link button, THE App SHALL open the associated URL in a new browser tab.
3. IF no Quick_Links exist in Local_Storage, THEN THE Quick_Links_Widget SHALL render an empty state without errors.

---

### Requirement 11: Quick Links — Adding Links

**User Story:** As a user, I want to add new quick links by providing a label and URL, so that I can customize my launcher.

#### Acceptance Criteria

1. WHEN a user provides a non-empty label and a non-empty URL and submits the add-link form, THE Quick_Links_Widget SHALL create a new Quick_Link and add it to the displayed list.
2. IF a user submits the add-link form with an empty label or empty URL, THEN THE Quick_Links_Widget SHALL reject the submission and leave the Quick_Link list unchanged.
3. WHEN a Quick_Link is successfully added, THE Quick_Links_Widget SHALL persist the updated Quick_Links list to Local_Storage immediately.
4. WHEN a Quick_Link is successfully added, THE Quick_Links_Widget SHALL clear the label and URL input fields.

---

### Requirement 12: Quick Links — Deleting Links

**User Story:** As a user, I want to delete quick links I no longer need, so that I can keep my launcher tidy.

#### Acceptance Criteria

1. WHEN a user activates the delete control for a Quick_Link, THE Quick_Links_Widget SHALL remove that Quick_Link from the displayed list.
2. WHEN a Quick_Link is deleted, THE Quick_Links_Widget SHALL persist the updated Quick_Links list to Local_Storage immediately.

---

### Requirement 13: Technical Constraints

**User Story:** As a developer, I want the application to be built with vanilla web technologies and a minimal file structure, so that it is easy to deploy and maintain without build tools or a server.

#### Acceptance Criteria

1. THE App SHALL be implemented using only HTML, CSS, and Vanilla JavaScript with no external libraries, frameworks, or runtime dependencies.
2. THE App SHALL contain exactly one CSS file located at `css/style.css`.
3. THE App SHALL contain exactly one JavaScript file located at `js/app.js`.
4. THE App SHALL store all persistent data exclusively in the browser's Local_Storage with no server-side calls.
5. THE App SHALL function correctly in current stable versions of Chrome, Firefox, Edge, and Safari.
