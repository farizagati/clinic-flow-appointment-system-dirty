# AGENTS.md

> This is the **single source of truth** for all AI coding agents working in this repository.
> If you are Antigravity, Claude (CLAUDE.md), GitHub Copilot (copilot-instructions.md),
> Cursor, Windsurf, or any other AI assistant -- follow the rules below.
> Do not create separate instruction files; refer back to this document.

---

## Project Overview

**ClinicFlow Appointment System, version B ("dirty")** is the legacy-style twin of
ClinicFlow version A
([farizagati/clinic-flow-appointment-system](https://github.com/farizagati/clinic-flow-appointment-system)).
It has the same React + Vite + Tailwind CSS app, the same flows and the same mock data,
but **no test hooks**. Learners use it to practise locating elements the way they would
in a real legacy app: by role, label, text and scoping, not by `data-testid`.

It uses HashRouter (base path `/clinic-flow-appointment-system-dirty/`, set in
`vite.config.js`), localStorage for all persistence (no backend), and role-based route
guards (member vs admin).

Version B started from version A at tag `clean-v1.0.0`.

---

## Rules

### 1. No test hooks

**Do not add `data-testid`, `data-test`, `data-cy`, `data-qa` or similar attributes.**
Do not add `id` attributes whose only purpose is to be a test hook.

An `id` is allowed only when the markup needs it:

- linked by `<label htmlFor>`, `aria-labelledby`, `aria-describedby`, `aria-controls`
  or `aria-activedescendant`
- generated with `useId()`
- a scroll or anchor target used by the code (for example `home-features`)

Some components still accept props named `dataTestId`, `testId` or `testIdPrefix`. They
render nothing and exist only so changes from version A merge with fewer conflicts.
Do not make them render again.

### 2. Keep the intentional hard spots

These are deliberate. Do not "fix" them. Each one is marked in the code with a
`Hard spot (version B)` comment.

| Hard spot | Where | What it teaches |
| --- | --- | --- |
| Icon-only button with no accessible name | Theme toggle in `src/layouts/Navigation.jsx` | Locating without a name: scope to the header, filter by the icon text |
| Repeated buttons with the same name | Approve and Cancel in every row of `src/components/admin/AdminAppointments.jsx` | Scope to the row first (`getByRole('row').filter(...)`), then find the button |
| Dynamic id | Review Appointment button in `src/pages/BookAppointment.jsx` (`btn-review-xxxxxx`, new on every render) | Why `#id` selectors break; prefer role and name |

Add a new hard spot only when asked, mark it with the same comment, and list it here.

### 3. Otherwise keep the accessibility tree clean

Apart from the hard spots above, role and label locators must work.

- Icon spans (`material-symbols-outlined`) carry `aria-hidden="true"`.
- Icon-only controls other than the theme toggle keep their `aria-label` (for example the
  settings link, labelled "Settings").
- Clickable things are `<button>` or `<a>`, never a `<div>` with `onClick`.
- Every form field has a `<label htmlFor>` or an `aria-label`.
- One `<main>` per page. It lives in `src/layouts/Layout.jsx`.
- Error banners use `role="alert"`, success banners use `role="status"`.
- Each route sets `document.title` through `PAGE_TITLES` in `src/layouts/Layout.jsx`.

### 4. Parity with version A

The same Playwright suite, written with role and label locators, must pass on A and B.
A failure on B that is not about a locator means the flows have drifted.

- Change flows, text, page titles, roles and labels in version A first, then bring the
  change here (`git cherry-pick` works, since both repos share history).
- Keep visible text, headings, page titles and validation messages identical to A.
- The only intended differences are: no test hooks, the hard spots, the base path and
  the localStorage key prefix.

### 5. No emojis in documentation

When writing or editing any documentation file (README, markdown reports, code comments,
JSDoc, commit messages), **do not use emojis**. Keep the tone plain and professional.

### 6. Preserve existing conventions

- Styling: Tailwind CSS utility classes. Design tokens are in `tailwind.config.js` and
  `src/index.css`.
- Routing: HashRouter with route guards in `src/App.jsx`.
- State: React Context (`AuthContext`, `ThemeContext`) backed by localStorage.
- Mock data lives in `src/data/mockData.js`.
- Images live in `src/assets/` and are imported into components. Do not link images
  from external hosts.

### 7. Do not introduce a backend

All data is stored in localStorage. Do not add a database, API server, or any
network-dependent data layer.

### 8. Keep dependencies minimal

Do not add new npm packages without explicit user approval.

---

## Quick Reference

| Item                | Detail                                                |
| ------------------- | ----------------------------------------------------- |
| Dev server          | `npm run dev` (Vite, default port 5173)               |
| App URL             | `http://localhost:5173/clinic-flow-appointment-system-dirty/#/` |
| Hosted URL          | `https://farizagati.github.io/clinic-flow-appointment-system-dirty/` |
| Build               | `npm run build` (outputs to `dist/`)                  |
| Routing             | HashRouter (`/#/login`, `/#/book-appointment`, etc.)  |
| Auth                | localStorage-based, see `src/contexts/AuthContext.jsx`|
| Member test account | `johnyjohnyyespapa@mail.com` / `EatingSugarNoPapa`    |
| Admin test account  | `admin@example.com` / `ThisIsNotAdmin`                |

### localStorage keys

Version A and version B are served from the same origin on GitHub Pages, so every key
in B starts with `clinicflow_dirty_` to keep the two apps apart:

`clinicflow_dirty_users`, `clinicflow_dirty_currentUser`, `clinicflow_dirty_appointments`,
`clinicflow_dirty_doctors`, `clinicflow_dirty_departments`, `clinicflow_dirty_clinics`,
`clinicflow_dirty_theme`.

Version A uses the same names without `dirty_` (and plain `theme`). A test that writes
these keys directly must use the right prefix for each app. Logging in through the UI
and saving `storageState` works on both without changes.

---

## Testing Notes

### Locating elements

There are no test ids. Use, in order of preference:

1. `getByRole` with a name
2. `getByLabel`
3. `getByText`
4. Scoping and filtering (`filter`, `has`, `hasText`, chaining)
5. CSS, as a last resort

### Book Appointment

- Clinic, department and time slot are native `<select>` elements:
  `getByLabel('Select Clinic *')`, `getByLabel('Select Department *')`,
  `getByLabel('Select Time Slot *')`.
- The doctor field is a combobox named "Search Doctor *", not a `<select>`. Its options
  live in a listbox with the same name. Scope to it, because `getByRole('option')` on its
  own also matches the native `<select>` options.
- Results update 400ms after the last keystroke. While waiting, a "Searching..." row is
  shown.
- The date field opens a calendar grid. Day buttons are named like
  "Saturday, November 21st, 2026".

```js
await page.getByRole('combobox', { name: 'Search Doctor *' }).fill('smith');
await page.getByRole('listbox', { name: 'Search Doctor *' })
  .getByRole('option', { name: /ClinicFlow Westside/ }).click();
```

### Doctor search (Home)

Same component with `showSearching={false}`: no "Searching..." row and no `aria-busy`.
The previous list stays in place until the new results replace it.

### Admin dashboard

- Tabs are buttons: "Dashboard Stats", "Appointments", "Users Database", "Departments",
  "Doctors". The active tab has `aria-current="page"`.
- Every appointment row has its own "Approve" and "Cancel" buttons. Scope to the row:

```js
const row = page.getByRole('row').filter({ hasText: 'patient@example.com' });
await row.getByRole('button', { name: 'Approve' }).click();
```

- Add and edit forms are dialogs (`getByRole('dialog')`). Escape closes them.
- Delete asks for confirmation in a second dialog.

### Navigation

- Below the `md` breakpoint the top links are hidden. The "Open menu" button opens the
  mobile menu.
- The theme toggle has no accessible name (hard spot). The settings link is labelled
  "Settings".
- Page titles follow "{Page} | ClinicFlow". Home keeps "ClinicFlow Appointment System".

---

## Skills

### smart-commit

**Description:** Incrementally stage and commit git changes grouped by logical context, with conventional commit messages.

**When to use:** User says "smart commit", "commit by context", "gradual commit", "group my changes", "split commits", "organize commits", or "help me commit".

**Location:** [.agents/skills/smart-commit/SKILL.md](.agents/skills/smart-commit/SKILL.md)
