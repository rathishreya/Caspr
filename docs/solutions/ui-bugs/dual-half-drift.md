---
title: A fix that landed on the half nobody tests
date: 2026-08-25
category: ui-bugs
module: screen-shell
problem_type: ui_bug
component: frontend_stimulus
symptoms:
  - A password could not be changed on a phone, because the compact form had no submit control
  - Delete account pressed and raised nothing on the compact half
  - The whole suite stayed green throughout
root_cause: scope_issue
resolution_type: code_fix
severity: high
tags: [dual-half, responsive, testing-library, react, spa, query-scoping, guard-verification]
---

# A fix that landed on the half nobody tests

## Problem

Every screen in `apps/web` renders **two halves into the same DOM** and hides one with CSS. A desktop half (`hidden … shell:block`) and a compact half (`shell:hidden`) are both mounted; the breakpoint decides which is painted. Twelve pages do this. It is the shell model working as designed — the compact half is not a narrower desktop, it is a different composition (the nav pane becomes a drawer, the plans pane becomes a peek sheet), so both compositions have to exist.

The failure mode this creates has nothing to do with rendering and everything to do with querying: **a fix lands on one half and the other keeps the old markup**, and no default Testing Library query can tell the difference.

On 2026-08-25 the Account password form was rewired. `usePasswordForm` in `apps/web/src/pages/AccountPage.tsx` was written — controlled `current` / `next` / `confirm`, a confirmation-match guard, a 12-character minimum mirroring `PASSWORD_MIN` in the backend's `auth/schemas.py`, and a call into `auth.changePassword`. `CardField` in `apps/web/src/features/account/SettingsCard.tsx` gained `value`, `onChange`, `autoComplete` and `disabled` for the same reason; its docstring records the prior state plainly — *"every one of them was scenery."*

The rewiring was applied to the desktop half only. The compact half kept three bare `CardField`s: no `value`, no `onChange`, and **no submit control of any kind**. A password could not be changed on a phone — not "changed and silently discarded", but *not submittable*, because there was no button to press.

The same session left a second gap in the same half. The compact Devices card rendered `<SettingsCard rows={DEVICES} />` with no `onRow`, where the desktop copy passed `onRow={(id) => id === 'delete' && setOpenModal(id)}`. `SettingsCard` renders a `danger`/`plain` row as a `<button onClick={() => onRow?.(row.id)}>` — the row *is* the target — so on compact **Delete account fired into `undefined`**. The control a GDPR obligation rests on, dead on the half most people use, and visually indistinguishable from a live one.

## Symptoms

- Password change works in a desktop browser and is impossible on a phone. No error, no failed request — the form has no commit.
- Compact password fields are uncontrolled: typing works, nothing reads the value, and a password manager has no `autoComplete` hint to distinguish current from new.
- `Delete account` on the compact Devices section looks pressable, presses, and raises nothing.
- **The entire suite is green.** `AccountPage.test.tsx` asserts the password field exists and submits, and passes — against the desktop copy.

## What Didn't Work

**The existing tests could not have caught it.** No test scoped to a half. `getByLabelText`, `getByText`, `getByRole` and friends resolve against the whole container and return the **first match in document order** — which is the desktop half, because it is written first in `AccountPage.tsx` (line 611; compact begins at 744). Every assertion about "the password field" was an assertion about the desktop password field. A duplicated DOM does not make these queries ambiguous in a way they complain about; it makes them silently specific to the wrong subtree.

Worse, most pages could not have been scoped even by a test that wanted to. Before this session **exactly one of the twelve dual-half pages carried `data-half` markers**. Eleven had no handle at all.

The general check that came out of this — `apps/web/src/pages/dualHalfParity.test.tsx` — took two calibration failures to arrive at, and both are the real lesson.

**Calibration failure 1 — it compared every control, and cried wolf on every screen.** The first version diffed all interactive elements between halves. It flagged the desktop navigation pane on every page, because on compact that pane is a drawer that is not open. That is the shell model working exactly as specified, reported as a defect. A check that reports designed differences as failures is a check somebody deletes within a week, so its findings have to be things a reader agrees are wrong. Narrowed to **fields**: a text input is a text input on both halves, and one that appears on only one side is genuinely missing.

**Calibration failure 2 — `hasSubmit` returned true on code known to be broken.** The first `hasSubmit` asked whether the compact half contained a `<button>` *anywhere*. It does — the account menu, the peek sheet, every `SettingsCard` chevron. So it returned `true` with the password card still submit-less. This was not caught by reasoning about it; it was caught by **deliberately re-breaking the compact form and watching the check pass**. A guard that has never been observed failing is an assertion about nothing.

**Calibration failure 3 — a single field is not a form.** A rescoped `hasSubmit` then flagged Documents, whose compact half has a search box. A search field acts as you type and correctly has no submit beside it. Exempted below two fields: one field is a filter, two or more are a form.

## Solution

**1. Wire both halves.** The compact password card now renders the same controlled fields as the desktop one, plus its own commit — `wide` because a phone has no far gutter for a 184px button to sit against, which is the only legitimate difference between the two:

```tsx
{/* compact half — AccountPage.tsx */}
<CardField
  label="CURRENT PASSWORD"
  placeholder="Enter current password"
  type="password"
  autoComplete="current-password"
  value={password.current}
  onChange={password.setCurrent}
  disabled={password.busy}
/>
{/* … NEW PASSWORD, CONFIRM NEW PASSWORD … */}
<CardButton wide onClick={() => void password.submit()} disabled={password.busy}>
  {password.busy ? 'Updating…' : 'Update password'}
</CardButton>
<FormNote error={password.error} done={password.done && 'Password updated.'} />
```

Both halves consume the same `usePasswordForm()` instance, so there is one state and one submit path; only the layout differs. The compact Devices card takes the `onRow` the desktop one always had:

```tsx
<SettingsCard rows={DEVICES} onRow={(id) => id === 'delete' && setOpenModal(id)} />
```

**2. The general check** — `dualHalfParity.test.tsx`. It finds the halves **by the classes that hide them**, not by `data-half`, so it works on all twelve screens today rather than the one that happened to be annotated:

```ts
function halves(root: HTMLElement) {
  const all = [...root.querySelectorAll<HTMLElement>('div')];
  return {
    compact: all.filter((el) => el.className.includes('shell:hidden')),
    desktop: all.filter(
      (el) =>
        /(^|\s)hidden(\s|$)/.test(el.className) &&
        (el.className.includes('shell:block') || el.className.includes('shell:flex')),
    ),
  };
}
```

Fields are collected **by label**, not by count — "the compact half is missing *CONFIRM NEW PASSWORD*" is actionable where "desktop has 3, compact has 2" is a puzzle. The accessible name falls back through `aria-label` → `label[for]` → `placeholder`.

The submit check is scoped to the fields' **lowest common ancestor**, which is what the second calibration failure bought:

```ts
function submitBesideFields(roots: HTMLElement[]): boolean {
  const inputs = roots.flatMap((r) => [...r.querySelectorAll<HTMLElement>('input')]);
  if (inputs.length < 2) return true;           // one field is a filter, not a form

  let common: HTMLElement | null = inputs[0]!.parentElement;
  for (const input of inputs.slice(1)) {
    while (common && !common.contains(input)) common = common.parentElement;
  }
  return common?.querySelector('button') != null;
}
```

The assertion runs per screen, and for `AccountPage` per section (`details`, `password`, `devices`, `notifications`, `preferences`), because the drift lands inside one section at a time. Screens whose halves genuinely differ are **named in the test rather than omitted** — `WalletPage`, `ConversationPage`, `LayoutCanvasPage`, `GenerationPage`, `WorkingPage` — with a final assertion that the two lists total 12, so adding a screen means arguing with the list instead of quietly skipping it.

**3. The per-screen test** — `AccountPage.compact.test.tsx` — scopes with `within()` on the marker, and covers what the general check structurally cannot:

```tsx
const compact = container.querySelector('[data-half="compact"]');
if (!compact) throw new Error('No compact half rendered — the selector has moved.');
return within(compact as HTMLElement);
```

One note from writing it, worth carrying: the delete-confirmation assertion uses `queryAllByText`, not `queryByText`. `AccountModal` is itself dual-half — a desktop card and a compact drawer, one hidden by CSS — so the confirmation copy is in the DOM twice once it opens. The original single-match query failed *because the fix worked*. Duplicate DOM does not only defeat queries against the page under test; it defeats them against everything the page opens.

## Why This Works

**Why query-by-label resolves to the wrong half.** CSS visibility is not a Testing Library concept unless you opt into it. `getByLabelText` walks the container, collects every match, and — for the singular form — returns the one match or throws on several. Here it does not throw, because the halves are not identical: only one of them had a labelled, wired field at a time, or where both matched, document order decides. `display: none` is applied by a Tailwind `shell:` breakpoint variant that **jsdom does not evaluate at all**, since there is no layout and no matched media query. So both halves are equally "visible" to every query, and the desktop half wins simply by being written first. This is the transferable half of the bug: **CSS-hidden duplicate DOM defeats every default query, silently and in favour of whichever copy the author happened to write first.**

**Why the lowest common ancestor is the right boundary.** "Is there a submit for these fields?" is a question about a form, and a form's extent is not the screen — it is the smallest element that contains all of its fields. Ask the question of the half and the answer is always yes, because a screen contains buttons for a dozen unrelated reasons. Ask it of an arbitrary fixed depth and it breaks the moment somebody adds a wrapper `div`. The LCA is the form's container **by construction**: it is the tightest box that could hold a submit which belongs to those fields, and any button outside it demonstrably belongs to something else. That is why it distinguishes the real defect (three password fields, no commit) from the false positive (three password fields, and an account menu button elsewhere in the subtree).

**Why fields and not controls.** Fields are the part of a composition that is semantically identical across halves. Panes, drawers, peeks and sheets are the part that is deliberately different. Restricting the diff to inputs puts the check exactly on the surface where "different" always means "wrong".

## Prevention

**Verify the check by breaking the code.** This is the most transferable lesson here and it applies to any new guard, not just this one. A guard is not finished when it passes on correct code — that is the state a guard reaches by asserting nothing. It is finished when you have **watched it fail on code you deliberately broke, and read its failure message**. The second calibration failure above was invisible to review and obvious to a probe: re-break the compact form, run the check, and it stayed green. The procedure:

1. Write the guard.
2. Reintroduce the exact defect it exists to catch. Run it. **It must go red.**
3. Read the message it prints. If it does not name the file, the half and the missing thing, fix the message — a red bar nobody can act on gets skipped, then deleted.
4. Restore the code. Confirm green.
5. Then check the inverse: run it against the designed differences (Wallet's peek, Documents' search box) and confirm it stays quiet. A guard that cries wolf is deleted just as surely as one that never barks.

**A guard you have not watched fail is not a guard.**

Alongside that, three things now hold this closed:

- **`dualHalfParity.test.tsx`** — field-inventory parity plus the submit check, across seven parity screens and, for Account, five sections. Class-based half detection, so it covers screens that carry no `data-half` marker.
- **A written rule** in `apps/web/src/pages/AGENTS.md`, contract 1: *"Both halves, always — a change to one is a change to both."* It states the cause explicitly, so the next reader does not have to rediscover why `getByLabelText` lied.
- **Per-screen compact tests scoped with `within()`**, because of what the parity check deliberately cannot see.

**State the limit, or the green bar gets over-read.** `dualHalfParity` compares markup. React does not put event handlers in the DOM, so **a control present on both halves but wired on only one is completely invisible to it** — `onRow` missing from the compact Devices card would pass every parity assertion, since the button is right there in the markup. That is precisely the Delete-account defect, and only a per-screen behavioural test scoped to the compact subtree catches it. Likewise a field present on both halves but `disabled` on one passes, unless the label happens to differ.

Structural parity and behavioural wiring are two different checks. Shipping one and believing you have both is how this bug happened in the first place.
