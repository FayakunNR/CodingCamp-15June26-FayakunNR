'use strict';

// ─── Entry Point ────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initGreeting();
  initTimer();
  initTodo();
  initQuickLinks();
});

// ─── Theme (Light / Dark) ───────────────────────────────────────────────────

/**
 * Reads the active theme from the <html> data-theme attribute.
 * @returns {'dark'|'light'}
 */
function getActiveTheme() {
  return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
}

/**
 * Applies a theme by setting data-theme on <html> and persisting it.
 * @param {'dark'|'light'} theme
 */
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  try {
    localStorage.setItem('theme', theme);
  } catch { /* private browsing — silently ignore */ }
  updateThemeToggleButton(theme);
}

/**
 * Updates the toggle button icon and aria-label to match the current theme.
 * @param {'dark'|'light'} theme
 */
function updateThemeToggleButton(theme) {
  const btn = document.getElementById('btn-theme-toggle');
  if (!btn) return;
  if (theme === 'dark') {
    btn.textContent = '☀️';
    btn.setAttribute('aria-label', 'Switch to light mode');
  } else {
    btn.textContent = '🌙';
    btn.setAttribute('aria-label', 'Switch to dark mode');
  }
}

/**
 * Initialises the theme toggle button.
 * The correct data-theme is already set on <html> by the inline script in <head>.
 */
function initTheme() {
  // Sync button state with the theme resolved by the inline head script
  updateThemeToggleButton(getActiveTheme());

  document.getElementById('btn-theme-toggle').addEventListener('click', () => {
    applyTheme(getActiveTheme() === 'dark' ? 'light' : 'dark');
  });
}

// ─── Greeting Section ───────────────────────────────────────────────────────

/**
 * Returns the time-of-day greeting based on the given hour (0–23).
 * @param {number} hour
 * @returns {string}
 */
function getGreetingText(hour) {
  if (hour >= 5 && hour <= 11) return 'Good Morning';
  if (hour >= 12 && hour <= 17) return 'Good Afternoon';
  return 'Good Evening'; // 18–23 and 0–4
}

/**
 * Loads the saved name from localStorage, or returns an empty string.
 * @returns {string}
 */
function loadName() {
  try {
    return localStorage.getItem('userName') || '';
  } catch {
    return '';
  }
}

/**
 * Persists the user name to localStorage.
 * @param {string} name
 */
function saveName(name) {
  try {
    localStorage.setItem('userName', name);
  } catch { /* silently ignore */ }
}

/**
 * Formats a Date object as 12-hour HH:MM AM/PM.
 * @param {Date} date
 * @returns {string}
 */
function formatTime(date) {
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${ampm}`;
}

/**
 * Formats a Date as "Weekday, Month DD".
 * @param {Date} date
 * @returns {string}
 */
function formatDate(date) {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Builds the greeting string for the h1, including the name if set.
 * @returns {string}
 */
function buildGreetingString() {
  const name = loadName();
  const base = getGreetingText(new Date().getHours());
  return name ? `${base}, ${name}!` : base;
}

/**
 * Updates the greeting h1, time, and date elements.
 * Only updates h1 if it's not currently in edit mode.
 */
function renderGreeting() {
  const now = new Date();
  const h1  = document.getElementById('greeting-text');
  if (h1) h1.textContent = buildGreetingString();
  document.getElementById('greeting-time').textContent = formatTime(now);
  document.getElementById('greeting-date').textContent = formatDate(now);
}

/**
 * Switches the greeting h1 into an inline text input for name editing.
 */
function startNameEdit() {
  const h1 = document.getElementById('greeting-text');
  if (!h1 || document.getElementById('greeting-edit-input')) return; // already editing

  const input = document.createElement('input');
  input.id          = 'greeting-edit-input';
  input.type        = 'text';
  input.maxLength   = 40;
  input.placeholder = 'Your name…';
  input.value       = loadName();
  input.setAttribute('aria-label', 'Enter your name');

  h1.replaceWith(input);
  input.focus();
  input.select();

  function commitEdit() {
    const name = input.value.trim();
    saveName(name);
    restoreGreetingH1();
  }

  function cancelEdit() {
    restoreGreetingH1();
  }

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter')  { e.preventDefault(); commitEdit(); }
    if (e.key === 'Escape') { e.preventDefault(); cancelEdit(); }
  });

  // blur fires when focus leaves — treat as commit
  input.addEventListener('blur', commitEdit, { once: true });
}

/**
 * Removes the inline input and restores the greeting h1.
 */
function restoreGreetingH1() {
  const input = document.getElementById('greeting-edit-input');
  if (!input) return;

  const h1 = document.createElement('h1');
  h1.id          = 'greeting-text';
  h1.textContent = buildGreetingString();
  h1.title       = 'Click to set your name';
  h1.setAttribute('role', 'button');
  h1.setAttribute('tabindex', '0');
  h1.setAttribute('aria-label', 'Greeting — click to set your name');

  input.replaceWith(h1);
  bindGreetingClick(h1);
}

/**
 * Binds the click / keyboard handler to the greeting h1.
 * @param {HTMLElement} el
 */
function bindGreetingClick(el) {
  el.addEventListener('click', startNameEdit);
  el.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); startNameEdit(); }
  });
}

/**
 * Initialises the greeting section.
 */
function initGreeting() {
  renderGreeting();
  setInterval(renderGreeting, 60_000);

  const h1 = document.getElementById('greeting-text');
  if (h1) {
    h1.title = 'Click to set your name';
    h1.setAttribute('role', 'button');
    h1.setAttribute('tabindex', '0');
    h1.setAttribute('aria-label', 'Greeting — click to set your name');
    bindGreetingClick(h1);
  }

  // Show the hint only on first visit (no name saved yet)
  if (!loadName()) {
    const hint = document.createElement('p');
    hint.id          = 'greeting-hint';
    hint.textContent = 'Click the greeting to set your name';
    document.getElementById('greeting-widget').appendChild(hint);

    // Hide the hint once the user has set a name
    const observer = new MutationObserver(() => {
      if (loadName()) { hint.remove(); observer.disconnect(); }
    });
    observer.observe(document.getElementById('greeting-widget'), { childList: true, subtree: true });
  }
}

// ─── Focus Timer ────────────────────────────────────────────────────────────

/** Default Pomodoro duration in seconds (25 min). */
const DEFAULT_DURATION = 1500;

/** Timer state: idle | running | paused */
const timerState = {
  duration:   DEFAULT_DURATION, // configured session length in seconds
  remaining:  DEFAULT_DURATION, // seconds left in current session
  status:     'idle',           // 'idle' | 'running' | 'paused'
  intervalId: null,
};

/**
 * Loads the saved Pomodoro duration from localStorage.
 * Falls back to DEFAULT_DURATION if nothing is stored or the value is invalid.
 * @returns {number} duration in seconds
 */
function loadTimerDuration() {
  try {
    const raw = parseInt(localStorage.getItem('timerDuration'), 10);
    return (raw > 0 && raw <= 10800) ? raw : DEFAULT_DURATION;
  } catch {
    return DEFAULT_DURATION;
  }
}

/**
 * Persists the Pomodoro duration to localStorage.
 * @param {number} seconds
 */
function saveTimerDuration(seconds) {
  try {
    localStorage.setItem('timerDuration', String(seconds));
  } catch { /* silently ignore */ }
}

/**
 * Formats seconds as zero-padded MM:SS string.
 * @param {number} seconds
 * @returns {string}
 */
function renderTimer(seconds) {
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');
  document.getElementById('timer-display').textContent = `${mm}:${ss}`;
}

/**
 * Enables/disables Start, Stop, and duration controls based on timer status.
 */
function updateTimerControls() {
  const btnStart  = document.getElementById('btn-start');
  const btnStop   = document.getElementById('btn-stop');
  const isRunning = timerState.status === 'running';
  const isIdle    = timerState.status === 'idle';

  btnStart.disabled = isRunning;
  btnStop.disabled  = !isRunning;

  // Duration controls only usable when idle
  document.querySelectorAll('.btn-duration').forEach((b) => { b.disabled = !isIdle; });
  const customInput = document.getElementById('timer-custom-minutes');
  if (customInput) customInput.disabled = !isIdle;
}

/**
 * Sets a new timer duration (in seconds), resets the display, and persists it.
 * Only callable when the timer is idle.
 * @param {number} seconds
 * @param {number|null} activeMinutes  The preset minute value to highlight, or null for custom.
 */
function setTimerDuration(seconds, activeMinutes) {
  if (timerState.status !== 'idle') return;
  timerState.duration  = seconds;
  timerState.remaining = seconds;
  saveTimerDuration(seconds);
  renderTimer(seconds);

  // Update active highlight on preset buttons
  document.querySelectorAll('.btn-duration').forEach((b) => {
    b.classList.toggle('active', activeMinutes !== null && Number(b.dataset.minutes) === activeMinutes);
  });
}

/**
 * Called every second while the timer is running.
 */
function tickTimer() {
  timerState.remaining -= 1;
  if (timerState.remaining <= 0) {
    resetTimer();
    notifyTimerEnd();
  } else {
    renderTimer(timerState.remaining);
  }
}

/** Starts or resumes the countdown. */
function startTimer() {
  if (timerState.status === 'running') return;
  timerState.status = 'running';
  updateTimerControls();
  timerState.intervalId = setInterval(tickTimer, 1000);
}

/** Pauses the countdown without resetting. */
function stopTimer() {
  clearInterval(timerState.intervalId);
  timerState.intervalId = null;
  timerState.status = 'paused';
  updateTimerControls();
}

/** Resets the timer to the configured duration in idle state. */
function resetTimer() {
  clearInterval(timerState.intervalId);
  timerState.intervalId = null;
  timerState.remaining  = timerState.duration;
  timerState.status     = 'idle';
  renderTimer(timerState.duration);
  updateTimerControls();
}

/** Notifies the user when the timer completes. */
function notifyTimerEnd() {
  alert("Time's up! Great work. Take a break.");
}

/**
 * Initialises the Focus Timer widget.
 */
function initTimer() {
  // Restore saved duration
  const saved = loadTimerDuration();
  timerState.duration  = saved;
  timerState.remaining = saved;

  renderTimer(saved);
  updateTimerControls();

  // Highlight the matching preset button (if any)
  const savedMinutes = saved / 60;
  document.querySelectorAll('.btn-duration').forEach((b) => {
    b.classList.toggle('active', Number(b.dataset.minutes) === savedMinutes);
  });

  // Preset duration buttons
  document.getElementById('timer-duration-controls').addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-duration');
    if (!btn || btn.disabled) return;
    const minutes = parseInt(btn.dataset.minutes, 10);
    document.getElementById('timer-custom-minutes').value = '';
    setTimerDuration(minutes * 60, minutes);
  });

  // Custom duration input — apply on Enter or blur
  const customInput = document.getElementById('timer-custom-minutes');
  function applyCustomDuration() {
    const val = parseInt(customInput.value, 10);
    if (!val || val < 1 || val > 180) return;
    setTimerDuration(val * 60, null);
  }
  customInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); applyCustomDuration(); } });
  customInput.addEventListener('blur', applyCustomDuration);

  document.getElementById('btn-start').addEventListener('click', startTimer);
  document.getElementById('btn-stop').addEventListener('click', stopTimer);
  document.getElementById('btn-reset').addEventListener('click', resetTimer);
}

// ─── To-Do List ─────────────────────────────────────────────────────────────

/** In-memory task array (source of truth while page is open). */
let tasks = [];

/** Active sort order: 'default' | 'az' | 'pending' | 'completed' */
let taskSortOrder = 'default';

// ── Persistence helpers ──────────────────────────────────────────────────────

/**
 * Loads tasks from localStorage.
 * @returns {Array}
 */
function loadTasks() {
  try {
    return JSON.parse(localStorage.getItem('tasks')) || [];
  } catch {
    return [];
  }
}

/**
 * Persists tasks to localStorage.
 * @param {Array} taskList
 * @returns {boolean} true on success, false on failure
 */
function saveTasks(taskList) {
  try {
    localStorage.setItem('tasks', JSON.stringify(taskList));
    return true;
  } catch {
    return false;
  }
}

// ── Validation & creation ────────────────────────────────────────────────────

/**
 * Returns true if the description string is non-empty after trimming.
 * @param {string} str
 * @returns {boolean}
 */
function validateDescription(str) {
  return str.trim().length > 0;
}

/**
 * Returns true if a task with the same description (case-insensitive) already exists.
 * @param {string} description
 * @returns {boolean}
 */
function isDuplicateTask(description) {
  const normalised = description.trim().toLowerCase();
  return tasks.some((t) => t.description.toLowerCase() === normalised);
}

/**
 * Shows or clears the inline error message below the task form.
 * @param {string} message  Empty string to clear.
 */
function setTaskError(message) {
  const el = document.getElementById('task-error');
  if (el) el.textContent = message;
}

/**
 * Creates a new task object.
 * @param {string} description
 * @returns {{ id: string, description: string, completed: boolean }}
 */
function createTask(description) {
  return {
    id: Date.now().toString(),
    description: description.trim(),
    completed: false,
  };
}

// ── Rendering ────────────────────────────────────────────────────────────────

/**
 * Returns a sorted copy of taskList based on the active sort order.
 * @param {Array} taskList
 * @returns {Array}
 */
function getSortedTasks(taskList) {
  const copy = [...taskList];
  if (taskSortOrder === 'az') {
    copy.sort((a, b) => a.description.localeCompare(b.description));
  } else if (taskSortOrder === 'pending') {
    copy.sort((a, b) => Number(a.completed) - Number(b.completed));
  } else if (taskSortOrder === 'completed') {
    copy.sort((a, b) => Number(b.completed) - Number(a.completed));
  }
  // 'default' preserves insertion order
  return copy;
}

/**
 * Rebuilds the #task-list ul from the current tasks array.
 * @param {Array} taskList
 */
function renderTaskList(taskList) {
  const ul = document.getElementById('task-list');
  const sorted = getSortedTasks(taskList);
  if (sorted.length === 0) {
    ul.innerHTML = '<li class="empty-state">No tasks yet. Add one above!</li>';
    return;
  }
  ul.innerHTML = sorted.map((task) => {
    const completedClass = task.completed ? 'task-completed' : '';
    const toggleSymbol   = task.completed ? '✓' : '○';
    return `
      <li class="${completedClass}" data-id="${task.id}">
        <button class="btn-toggle" data-action="toggle" data-id="${task.id}" aria-label="Toggle task">${toggleSymbol}</button>
        <span class="task-description">${escapeHtml(task.description)}</span>
        <button data-action="edit"   data-id="${task.id}" aria-label="Edit task">✏</button>
        <button data-action="delete" data-id="${task.id}" aria-label="Delete task">✕</button>
      </li>`;
  }).join('');
}

/**
 * Escapes HTML special characters to prevent XSS.
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ── CRUD operations ──────────────────────────────────────────────────────────

/**
 * Adds a new task if description is valid and not a duplicate.
 * @param {string} description
 */
function addTask(description) {
  if (!validateDescription(description)) return;
  if (isDuplicateTask(description)) {
    setTaskError('A task with that name already exists.');
    return;
  }
  setTaskError('');
  tasks.push(createTask(description));
  saveTasks(tasks);
  renderTaskList(tasks);
  document.getElementById('task-input').value = '';
}

/**
 * Deletes a task by id. Reverts if save fails.
 * @param {string} id
 */
function deleteTask(id) {
  const snapshot = [...tasks];
  tasks = tasks.filter((t) => t.id !== id);
  if (!saveTasks(tasks)) {
    tasks = snapshot;
  }
  renderTaskList(tasks);
}

/**
 * Toggles a task's completed state.
 * @param {string} id
 */
function toggleTask(id) {
  const task = tasks.find((t) => t.id === id);
  if (!task) return;
  task.completed = !task.completed;
  saveTasks(tasks); // no revert on failure per Requirement 7.4
  renderTaskList(tasks);
}

/**
 * Switches a task row into edit mode.
 * @param {string} id
 */
function startEditTask(id) {
  const task = tasks.find((t) => t.id === id);
  if (!task) return;
  const li = document.querySelector(`#task-list li[data-id="${id}"]`);
  if (!li) return;
  li.innerHTML = `
    <input
      class="task-edit-input"
      type="text"
      value="${escapeHtml(task.description)}"
      aria-label="Edit task"
    />
    <button data-action="save"   data-id="${id}" aria-label="Save edit">💾</button>
    <button data-action="cancel" data-id="${id}" aria-label="Cancel edit">✕</button>`;
  li.querySelector('.task-edit-input').focus();
}

/**
 * Confirms an edit. Reverts if save fails or value is invalid.
 * @param {string} id
 * @param {string} value
 */
function confirmEditTask(id, value) {
  if (!validateDescription(value)) {
    renderTaskList(tasks); // restore without changes
    return;
  }
  const task = tasks.find((t) => t.id === id);
  if (!task) return;
  const previous = task.description;
  task.description = value.trim();
  if (!saveTasks(tasks)) {
    task.description = previous;
  }
  renderTaskList(tasks);
}

/**
 * Cancels an edit and re-renders without changes.
 */
function cancelEditTask() {
  renderTaskList(tasks);
}

// ── Init ─────────────────────────────────────────────────────────────────────

/**
 * Initialises the To-Do widget.
 */
function initTodo() {
  tasks = loadTasks();
  renderTaskList(tasks);

  // Add task form submit
  document.getElementById('add-task-form').addEventListener('submit', (e) => {
    e.preventDefault();
    addTask(document.getElementById('task-input').value);
  });

  // Clear error when the user starts typing again
  document.getElementById('task-input').addEventListener('input', () => setTaskError(''));

  // Sort buttons
  document.getElementById('task-sort-controls').addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-sort');
    if (!btn) return;
    taskSortOrder = btn.dataset.sort;
    // Update active state
    document.querySelectorAll('.btn-sort').forEach((b) => {
      const isActive = b.dataset.sort === taskSortOrder;
      b.classList.toggle('active', isActive);
      b.setAttribute('aria-pressed', String(isActive));
    });
    renderTaskList(tasks);
  });

  // Event delegation for task list actions
  document.getElementById('task-list').addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;
    const { action, id } = btn.dataset;
    if (action === 'toggle') toggleTask(id);
    if (action === 'delete') deleteTask(id);
    if (action === 'edit')   startEditTask(id);
    if (action === 'save') {
      const input = btn.closest('li').querySelector('.task-edit-input');
      confirmEditTask(id, input ? input.value : '');
    }
    if (action === 'cancel') cancelEditTask();
  });
}

// ─── Quick Links ────────────────────────────────────────────────────────────

/** In-memory links array. */
let links = [];

// ── Persistence helpers ──────────────────────────────────────────────────────

/**
 * Loads quick links from localStorage.
 * @returns {Array}
 */
function loadLinks() {
  try {
    return JSON.parse(localStorage.getItem('quickLinks')) || [];
  } catch {
    return [];
  }
}

/**
 * Persists quick links to localStorage.
 * @param {Array} linkList
 * @returns {boolean}
 */
function saveLinks(linkList) {
  try {
    localStorage.setItem('quickLinks', JSON.stringify(linkList));
    return true;
  } catch {
    return false;
  }
}

// ── Validation & creation ────────────────────────────────────────────────────

/**
 * Returns true if both label and url are non-empty after trimming.
 * @param {string} label
 * @param {string} url
 * @returns {boolean}
 */
function validateLink(label, url) {
  return label.trim().length > 0 && url.trim().length > 0;
}

/**
 * Creates a new quick link object.
 * @param {string} label
 * @param {string} url
 * @returns {{ id: string, label: string, url: string }}
 */
function createLink(label, url) {
  return {
    id: Date.now().toString(),
    label: label.trim(),
    url: url.trim(),
  };
}

// ── Rendering ────────────────────────────────────────────────────────────────

/**
 * Rebuilds the #link-list div from the current links array.
 * @param {Array} linkList
 */
function renderLinks(linkList) {
  const container = document.getElementById('link-list');
  if (linkList.length === 0) {
    container.innerHTML = '<p class="empty-state">No links yet. Add one above!</p>';
    return;
  }
  container.innerHTML = linkList.map((link) => `
    <div class="link-item" data-id="${link.id}">
      <a href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(link.label)}</a>
      <button class="btn-delete-link" data-action="delete" data-id="${link.id}" aria-label="Delete link">✕</button>
    </div>`).join('');
}

// ── CRUD operations ──────────────────────────────────────────────────────────

/**
 * Adds a new quick link if both label and url are valid.
 * @param {string} label
 * @param {string} url
 */
function addLink(label, url) {
  if (!validateLink(label, url)) return;
  links.push(createLink(label, url));
  saveLinks(links);
  renderLinks(links);
  document.getElementById('link-label').value = '';
  document.getElementById('link-url').value = '';
}

/**
 * Deletes a quick link by id.
 * @param {string} id
 */
function deleteLink(id) {
  links = links.filter((l) => l.id !== id);
  saveLinks(links);
  renderLinks(links);
}

// ── Init ─────────────────────────────────────────────────────────────────────

/**
 * Initialises the Quick Links widget.
 */
function initQuickLinks() {
  links = loadLinks();
  renderLinks(links);

  // Add link form submit
  document.getElementById('add-link-form').addEventListener('submit', (e) => {
    e.preventDefault();
    addLink(
      document.getElementById('link-label').value,
      document.getElementById('link-url').value
    );
  });

  // Event delegation for delete buttons
  document.getElementById('link-list').addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action="delete"]');
    if (!btn) return;
    deleteLink(btn.dataset.id);
  });
}
