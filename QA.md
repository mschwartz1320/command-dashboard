# QA.md — Manual QA Checklist

This document covers manual QA checks that complement the automated Playwright suite.

---

## 1. Visual Polish

- [ ] App loads with no layout shift or flash of unstyled content
- [ ] Fonts (Inter) load correctly — titles are clean, no fallback fonts visible
- [ ] Color scheme is consistent — accent orange (#D97757), soft background (#faf9f5)
- [ ] Tag badges render with correct colors: blue (job), green (finance), purple (personal), orange (roots), teal (dev)
- [ ] Estimate badges and AI routing badges display cleanly
- [ ] Card borders and shadows look crisp — subtle depth without being heavy
- [ ] In Progress cards have left orange border; Waiting cards have grey border
- [ ] Empty state (no tasks in column) shows friendly message, not a blank void
- [ ] Sync indicator shows correct states: idle, syncing (accent), error (red)
- [ ] Header stays sticky when scrolling long task lists
- [ ] Sheet/modal opens with smooth animation from bottom
- [ ] Filter button active state (accent background) is clearly distinct from inactive

---

## 2. Mobile Feel (375px — iPhone SE / Pixel)

- [ ] All sections render in a single stacked column — no horizontal overflow
- [ ] Filter buttons scroll horizontally without showing a scrollbar
- [ ] Cards are touch-friendly — tap target large enough, no accidental taps
- [ ] FAB button is always accessible above content, not obscured
- [ ] Bottom sheet rises from bottom with handle visible
- [ ] Move grid buttons are large enough to tap without mis-tapping
- [ ] "Show more" expand text is reachable without zooming
- [ ] Tab navigation doesn't get clipped — all 3 tabs visible
- [ ] Memory and Insights tabs render readable markdown on small screen
- [ ] Insights sidebar items are tappable

---

## 3. Drag-and-Drop UX (Desktop, ≥768px)

- [ ] Cards can be dragged between columns (Todo → In Progress → Waiting → Done)
- [ ] Drag visual: card lifts slightly (shadow/opacity change) when dragging
- [ ] Drop target column highlights when hovering over it
- [ ] Card drops correctly and stays in destination column after drop
- [ ] Dragging reflects immediately in the UI (optimistic update)
- [ ] GitHub sync fires after drag — sync indicator briefly shows "syncing"
- [ ] After page reload, moved card is in the correct column (persisted to GitHub)
- [ ] Dragging a card and canceling (Escape or drop outside) returns card to original column
- [ ] Multiple drags in quick succession don't corrupt the board state

---

## 4. GitHub Sync Roundtrip

- [ ] Open TASKS.md raw on GitHub before and after test
- [ ] Add a task via the FAB form — verify new line appears in TASKS.md within ~5s
- [ ] Move a task via the card sheet — verify the task appears under its new section heading in TASKS.md
- [ ] Delete a task — verify the line is removed from TASKS.md
- [ ] Edit a task (if edit functionality exists) — verify the updated text appears in TASKS.md
- [ ] Hard-reload the page — all task state matches what's in TASKS.md
- [ ] Open the app in two browser tabs simultaneously — changes from one tab don't corrupt the other (last-write-wins is acceptable)
- [ ] Sync indicator shows "error" if GitHub API call fails (test by throttling network or using DevTools to block the API endpoint)
- [ ] App doesn't crash if TASKS.md is temporarily unavailable (graceful error state)

---

## 5. Add / Edit / Delete Flow

- [ ] Opening the FAB clears any previous form values
- [ ] Required fields (title) block form submission when empty
- [ ] Task appears immediately after adding (or after a short sync delay)
- [ ] Editing a task via the Edit button pre-populates the form with current values
- [ ] Confirm dialog fires before delete — canceling doesn't delete
- [ ] Deleting a task removes it from all sections/columns

---

## 6. Edge Cases

- [ ] Very long task title wraps cleanly in card and sheet, doesn't overflow
- [ ] Tasks with no description don't show "show more" button
- [ ] Tasks with no tag show no tag badge (invisible, not blank box)
- [ ] Tasks with no estimate don't show an empty estimate pill
- [ ] Empty TASKS.md (or blank sections) render without crashing
- [ ] Slow GitHub API (>3s) shows loading spinner, not a blank board
