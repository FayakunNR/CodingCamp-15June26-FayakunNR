# Requirements Document

## Introduction

This feature adds a light/dark mode toggle to the Life Dashboard web app. The app currently uses a dark-only theme driven by CSS custom properties. This feature introduces a light colour palette, a toggle button in the dashboard header, system preference detection via `prefers-color-scheme`, localStorage persistence of the user's chosen mode, smooth CSS transitions between themes, and full keyboard/screen-reader accessibility for the toggle control.

## Glossary

- **Dashboard**: The main page of the Life Dashboard app (`index.html`) containing the four widgets.
- **Theme_Controller**: The JavaScript module (within `app.js`) responsible for reading, persisting, and applying the active colour theme.
- **Toggle_Button**: The interactive button element added to the Dashboard that allows the user to switch between light and dark modes.
- **Active_Theme**: The currently applied colour theme, either `"dark"` or `"light"`, reflected as the `data-theme` attribute on the `<html>` element.
- **Dark_Theme**: The existing colour palette — background `#1a1a2e`, surface `#16213e`, accent `#0f3460`, highlight `#e94560`, text `#eaeaea`, muted `#888`.
- **Light_Theme**: The new colour palette — background `#f5f5f0`, surface `#ffffff`, accent `#e0e0d8`, highlight `#e94560`, text `#1a1a2e`, muted `#666`.
- **System_Preference**: The operating-system colour-scheme preference exposed by the `prefers-color-scheme` CSS media feature and `window.matchMedia` API.
- **Persisted_Preference**: The user's explicitly chosen theme stored under the key `"theme"` in `localStorage`.

---

## Requirements

### Requirement 1: Light Colour Palette

**User Story:** As a user, I want a light colour palette available in the app, so that I can use the dashboard in bright environments without eye strain.

#### Acceptance Criteria

1. THE Dashboard SHALL declare all six colour tokens (`--color-bg`, `--color-surface`, `--color-accent`, `--color-highlight`, `--color-text`, `--color-muted`) for the Light_Theme inside a `[data-theme="light"]` rule scoped to the `html` element, using the values specified in the Glossary.
2. IF the `<html>` element carries `data-theme="light"`, THEN THE Dashboard SHALL resolve all six colour custom properties to the Light_Theme values defined in the Glossary across every widget, button, input, and text element that consumes those properties.
3. IF the `<html>` element carries `data-theme="dark"` or has no `data-theme` attribute, THEN THE Dashboard SHALL resolve all six colour custom properties to the Dark_Theme values defined in the Glossary.

---

### Requirement 2: Theme Toggle Button

**User Story:** As a user, I want a clearly visible toggle button, so that I can switch between light and dark modes with a single interaction.

#### Acceptance Criteria

1. THE Dashboard SHALL render a Toggle_Button with a minimum hit area of 44 × 44 CSS pixels that is visible at all viewport widths supported by the existing responsive layout (≥ 320 px wide).
2. WHEN the Active_Theme is `"dark"`, THE Toggle_Button SHALL display a sun icon (☀️) and set its `aria-label` attribute to `"Switch to light mode"`.
3. WHEN the Active_Theme is `"light"`, THE Toggle_Button SHALL display a moon icon (🌙) and set its `aria-label` attribute to `"Switch to dark mode"`.
4. WHEN the user activates the Toggle_Button, THE Theme_Controller SHALL switch the Active_Theme from `"dark"` to `"light"` or from `"light"` to `"dark"`.
5. THE Toggle_Button SHALL be reachable via sequential keyboard navigation (Tab key) and operable by pressing Enter or Space.
6. THE Toggle_Button SHALL display a visible focus indicator (outline or equivalent) when it receives keyboard focus.
7. WHEN the Dashboard first loads with no Persisted_Preference and no detectable System_Preference, THE Active_Theme SHALL default to `"dark"`.

---

### Requirement 3: Smooth Theme Transition

**User Story:** As a user, I want the theme change to feel polished, so that the colour switch is not jarring.

#### Acceptance Criteria

1. WHEN the Active_Theme changes, THE Dashboard SHALL animate the background, text, and border colours of the page and all widget cards over a duration of 300 ms with a smooth ease timing curve.
2. WHEN the Active_Theme changes, THE Dashboard SHALL complete the colour transition within 350 ms.
3. WHEN the Dashboard page first loads, THE Dashboard SHALL display all widget cards in their initial theme colours without playing any colour transition animation.

---

### Requirement 4: System Preference Detection

**User Story:** As a new user, I want the dashboard to respect my OS colour-scheme preference on first load, so that I don't have to configure anything manually.

#### Acceptance Criteria

1. WHEN the Dashboard loads and `localStorage` does not contain a value under the key `"theme"`, THE Theme_Controller SHALL query the System_Preference using `window.matchMedia('(prefers-color-scheme: light)')`.
2. IF `window.matchMedia('(prefers-color-scheme: light)').matches` is `true` and `localStorage` does not contain a valid value under the key `"theme"`, THEN THE Theme_Controller SHALL set `data-theme="light"` on the `<html>` element as the initial Active_Theme.
3. IF `window.matchMedia('(prefers-color-scheme: light)').matches` is `false` and `localStorage` does not contain a valid value under the key `"theme"`, THEN THE Theme_Controller SHALL set `data-theme="dark"` on the `<html>` element as the initial Active_Theme.
4. IF `window.matchMedia` is unavailable or throws an error, THEN THE Theme_Controller SHALL set `data-theme="dark"` on the `<html>` element as the initial Active_Theme and SHALL NOT throw an unhandled exception.

---

### Requirement 5: Preference Persistence

**User Story:** As a returning user, I want my chosen mode to be remembered, so that I don't have to re-select it every time I open the dashboard.

#### Acceptance Criteria

1. WHEN the user activates the Toggle_Button, THE Theme_Controller SHALL write the new Active_Theme value (`"light"` or `"dark"`) to `localStorage` under the key `"theme"`.
2. WHEN the Dashboard loads and `localStorage` contains the value `"light"` or `"dark"` under the key `"theme"`, THE Theme_Controller SHALL apply that value as the initial Active_Theme, regardless of the System_Preference.
3. IF `localStorage` is unavailable (e.g. private-browsing restrictions), THEN THE Theme_Controller SHALL apply the System_Preference as the initial Active_Theme, falling back to `"dark"` if the System_Preference is also unavailable, and SHALL NOT throw an unhandled exception.
4. IF `localStorage` contains a value under the key `"theme"` that is neither `"light"` nor `"dark"`, THEN THE Theme_Controller SHALL ignore that value and resolve the initial Active_Theme from the System_Preference or the `"dark"` fallback as if no Persisted_Preference existed.

---

### Requirement 6: Theme Initialisation on Page Load

**User Story:** As a user, I want the correct theme applied instantly on page load, so that there is no visible flash of the wrong theme.

#### Acceptance Criteria

1. WHEN the Dashboard page begins loading, THE Theme_Controller SHALL resolve the initial Active_Theme by checking (in order): (a) a valid Persisted_Preference in `localStorage` under key `"theme"`, (b) the System_Preference via `window.matchMedia('(prefers-color-scheme: light)')`, (c) the default `"dark"` theme — and SHALL set the `data-theme` attribute on `<html>` to the resolved value before any widget content is rendered.
2. IF the `<html>` element carries `data-theme="light"`, THEN THE Dashboard SHALL resolve all CSS colour custom properties to the Light_Theme values.
3. IF the `<html>` element carries `data-theme="dark"`, THEN THE Dashboard SHALL resolve all CSS colour custom properties to the Dark_Theme values.
4. THE theme-resolution script SHALL be placed as an inline `<script>` element in the `<head>` of `index.html`, without `defer` or `async` attributes, so that it executes synchronously before the browser renders any body content.
