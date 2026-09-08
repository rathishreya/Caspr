# Testing Apparatus Phase 1 — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up the static gate, the failure-behaviour test matrix, the end-to-end journey suite, and the performance budgets for `caspr-app`, wired into CI so nothing reaches production without passing them.

**Architecture:** Three layers. (1) A static gate that runs in seconds on every commit — lint including a custom rule that bans hardcoded origins, secret scanning, dependency audit, SAST, bundle budget. (2) A fault-injection matrix that wraps the `CasprClient` seam and asserts every async surface reaches a *designed* state under every failure mode — this runs in Vitest, in-process, in seconds. (3) A Playwright suite covering real user journeys, accessibility, and interaction latency in real browsers. All targets are environment-driven; no test hardcodes a URL.

**Tech Stack:** Vitest 4 · React Testing Library · Playwright · ESLint 9 (flat config) · Semgrep OSS · gitleaks · osv-scanner · size-limit · Lighthouse CI · Bitbucket Pipelines

**Repo:** `C:\Users\joysh\Claude-Local\caspr-app` (npm workspaces monorepo). All paths below are relative to that root.

**Prerequisite:** The product build is complete and committed to git. This plan does not begin before that.

---

## Working agreements

- **TDD throughout.** Write the failing test, watch it fail, implement, watch it pass, commit.
- **One commit per task.** Conventional commit messages.
- **Expect red.** Tasks 8 and 12 deliberately produce failing tests on first run. Each failure is a genuine gap in the product's failure behaviour. Fixing them is real product work — record each in `QUESTIONS-FOR-JOY.md` and fix in order of journey importance. Do **not** weaken an assertion to make it pass.
- **No hardcoded URLs in test code either.** Tests read targets from environment variables. The rule applies to the apparatus as much as to the app.

---

## File structure

| Path | Responsibility |
|---|---|
| `eslint.config.js` | Flat ESLint config for the workspace |
| `tools/eslint-rules/no-hardcoded-origin.js` | Custom rule: origins/ports must come from config |
| `tools/eslint-rules/no-hardcoded-origin.test.js` | RuleTester coverage for the rule |
| `tools/eslint-rules/index.js` | Local plugin export |
| `.gitleaks.toml` | Secret-scanning config |
| `audit-allowlist.json` | Documented, dated exceptions to dependency audit |
| `.semgrep.yml` | SAST ruleset selection |
| `.size-limit.json` | Bundle budgets |
| `apps/web/src/components/ui/AsyncState.tsx` | The one component every loading/error/empty/offline surface renders |
| `apps/web/src/components/ui/AsyncState.test.tsx` | Its tests |
| `apps/web/src/test/faults.ts` | `HttpError`, `FaultKind`, `withFault` client decorator |
| `apps/web/src/test/faults.test.ts` | Tests for the decorator itself |
| `apps/web/src/test/designedState.ts` | `expectDesignedState` / `expectRecoveryAvailable` assertion helpers |
| `apps/web/src/test/faultMatrix.ts` | The operation × fault table — the single source of the matrix |
| `apps/web/src/test/faultMatrix.test.tsx` | Generated matrix tests |
| `e2e/playwright.config.ts` | Playwright config, env-driven baseURL |
| `e2e/fixtures.ts` | Shared fixtures: signed-in context, network recorder |
| `e2e/journeys/activation.spec.ts` | Signup → first report |
| `e2e/journeys/wallet.spec.ts` | Trial → spend → insufficient → checkout |
| `e2e/journeys/auth.spec.ts` | Sign in, persistence, expiry, sign out |
| `e2e/journeys/documents.spec.ts` | Upload validation, PDF and PPTX export |
| `e2e/journeys/comingSoon.spec.ts` | Coming-soon surfaces render; no dead links |
| `e2e/a11y/accessibility.spec.ts` | axe-core across every route |
| `e2e/perf/interaction.spec.ts` | Interaction latency + red-dot zero-network assertion |
| `e2e/perf/soak.spec.ts` | 30-minute Theater memory soak (nightly) |
| `lighthouserc.json` | Lighthouse CI budgets |
| `bitbucket-pipelines.yml` | Modified: gate + E2E + nightly |

---

## Task 1: ESLint baseline

**Files:**
- Create: `eslint.config.js`
- Modify: `package.json` (root — devDependencies, `lint` script)
- Modify: `apps/web/package.json` (add `lint` script)

- [ ] **Step 1: Install ESLint and plugins**

```bash
npm install -D -w . eslint@^9 typescript-eslint@^8 eslint-plugin-react-hooks@^5 @eslint/js@^9 globals@^15
```

- [ ] **Step 2: Create the flat config**

Create `eslint.config.js`:

```js
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';

export default tseslint.config(
  { ignores: ['**/dist/**', '**/node_modules/**', '**/*.d.ts'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: { 'react-hooks': reactHooks },
    rules: {
      ...reactHooks.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-console': ['error', { allow: ['warn', 'error'] }],
    },
  },
  {
    files: ['**/*.test.{ts,tsx}', '**/test/**', 'e2e/**'],
    rules: { 'no-console': 'off' },
  },
);
```

- [ ] **Step 3: Add the root lint script**

In root `package.json`, replace the `lint` script:

```json
"lint": "eslint ."
```

- [ ] **Step 4: Run lint and fix what it finds**

Run: `npm run lint`
Expected: a list of violations in existing code. Fix each one. Do not add blanket `eslint-disable` comments — if a rule is genuinely wrong for this codebase, change the config and say why in a comment.

- [ ] **Step 5: Verify clean**

Run: `npm run lint`
Expected: exit 0, no output.

- [ ] **Step 6: Commit**

```bash
git add eslint.config.js package.json package-lock.json apps packages services
git commit -m "chore: add ESLint flat config baseline"
```

---

## Task 2: Custom rule — no hardcoded origins

Project rule 16 (`BUILD-STATUS.md`): no hardcoded domains, absolute roots, API URLs or ports. This was a direct complaint from Jayant. A lint rule makes it a build failure rather than a review comment.

**Files:**
- Create: `tools/eslint-rules/no-hardcoded-origin.js`
- Create: `tools/eslint-rules/no-hardcoded-origin.test.js`
- Create: `tools/eslint-rules/index.js`
- Modify: `eslint.config.js`

- [ ] **Step 1: Write the failing test**

Create `tools/eslint-rules/no-hardcoded-origin.test.js`:

```js
import { RuleTester } from 'eslint';
import { describe, it } from 'vitest';
import rule from './no-hardcoded-origin.js';

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

describe('no-hardcoded-origin', () => {
  it('passes valid and rejects invalid', () => {
    ruleTester.run('no-hardcoded-origin', rule, {
      valid: [
        { code: 'const url = config.backendOrigin + "/wallet";' },
        { code: 'const p = "/analyses/123";' },
        // SVG and XML namespaces are identifiers, not network origins.
        { code: 'const ns = "http://www.w3.org/2000/svg";' },
        { code: 'const ns = "http://www.w3.org/1999/xlink";' },
      ],
      invalid: [
        {
          code: 'const url = "https://api.caspr.ai/wallet";',
          errors: [{ messageId: 'hardcodedOrigin' }],
        },
        {
          code: 'const ws = "ws://localhost:8789";',
          errors: [{ messageId: 'hardcodedOrigin' }],
        },
        {
          code: 'const host = "localhost:8787";',
          errors: [{ messageId: 'hardcodedOrigin' }],
        },
        {
          code: 'const url = `https://${host}/x`;',
          errors: [{ messageId: 'hardcodedOrigin' }],
        },
      ],
    });
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run tools/eslint-rules/no-hardcoded-origin.test.js`
Expected: FAIL — cannot resolve `./no-hardcoded-origin.js`.

- [ ] **Step 3: Write the rule**

Create `tools/eslint-rules/no-hardcoded-origin.js`:

```js
/**
 * Origins, hosts and ports must come from `src/config/env.ts` so the app
 * re-points across environments by config, never by code edit.
 * Project rule 16 (BUILD-STATUS.md).
 */

// Namespace URIs are identifiers, not network endpoints. They never resolve.
const NAMESPACE_PREFIXES = ['http://www.w3.org/', 'http://purl.org/', 'http://schema.org/'];

const ORIGIN = /^(https?|wss?):\/\//i;
const BARE_HOST_PORT = /^(localhost|127\.0\.0\.1|0\.0\.0\.0)(:\d+)?$/i;

function offends(value) {
  if (typeof value !== 'string' || value === '') return false;
  if (NAMESPACE_PREFIXES.some((p) => value.startsWith(p))) return false;
  return ORIGIN.test(value) || BARE_HOST_PORT.test(value);
}

export default {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Disallow hardcoded origins, hosts and ports outside the config module',
    },
    messages: {
      hardcodedOrigin:
        'Hardcoded origin "{{value}}". Read it from src/config/env.ts instead (project rule 16).',
    },
    schema: [],
  },
  create(context) {
    return {
      Literal(node) {
        if (offends(node.value)) {
          context.report({
            node,
            messageId: 'hardcodedOrigin',
            data: { value: String(node.value) },
          });
        }
      },
      TemplateElement(node) {
        if (offends(node.value.cooked)) {
          context.report({
            node,
            messageId: 'hardcodedOrigin',
            data: { value: String(node.value.cooked) },
          });
        }
      },
    };
  },
};
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run tools/eslint-rules/no-hardcoded-origin.test.js`
Expected: PASS.

- [ ] **Step 5: Export the local plugin**

Create `tools/eslint-rules/index.js`:

```js
import noHardcodedOrigin from './no-hardcoded-origin.js';

export default {
  rules: { 'no-hardcoded-origin': noHardcodedOrigin },
};
```

- [ ] **Step 6: Wire the rule into the config**

In `eslint.config.js`, add the import at the top:

```js
import caspr from './tools/eslint-rules/index.js';
```

Then append this config block before the test-file override block:

```js
  {
    files: ['**/*.{ts,tsx}'],
    // env.ts is the one place an origin default may appear. Tests, Vite config
    // and the e2e suite read targets from environment variables at runtime.
    ignores: [
      'apps/web/src/config/env.ts',
      '**/*.test.{ts,tsx}',
      '**/vite.config.ts',
      'e2e/**',
    ],
    plugins: { caspr },
    rules: { 'caspr/no-hardcoded-origin': 'error' },
  },
```

- [ ] **Step 7: Run lint across the repo**

Run: `npm run lint`
Expected: violations in any product code that hardcodes an origin. Fix each by routing through `config` in `apps/web/src/config/env.ts`. Add a new config field if one is needed.

- [ ] **Step 8: Verify clean**

Run: `npm run lint`
Expected: exit 0.

- [ ] **Step 9: Commit**

```bash
git add tools eslint.config.js apps packages services
git commit -m "feat(lint): ban hardcoded origins outside config module"
```

---

## Task 3: Secret scanning and dependency audit

**Files:**
- Create: `.gitleaks.toml`
- Create: `audit-allowlist.json`
- Create: `scripts/audit-check.mjs`
- Modify: `package.json` (root — `security:deps` script)

- [ ] **Step 1: Create the gitleaks config**

Create `.gitleaks.toml`:

```toml
title = "Caspr secret scanning"

[extend]
useDefault = true

[[rules]]
id = "caspr-private-key"
description = "Private signing key material"
regex = '''-----BEGIN (RSA |EC )?PRIVATE KEY-----'''
tags = ["key", "critical"]

[allowlist]
description = "Test fixtures generate ephemeral keys at runtime, never commit them"
paths = ['''.*\.test\.ts$''']
```

- [ ] **Step 2: Run gitleaks against history**

Run: `npx gitleaks@latest detect --config .gitleaks.toml --redact --no-banner`
Expected: `no leaks found`. If leaks are found, rotate the exposed credential first, then remove it from history — do not simply delete the line.

- [ ] **Step 3: Create the audit allowlist**

Create `audit-allowlist.json`. Every entry needs a reason and a review date — an allowlist without expiry becomes permanent blindness.

```json
{
  "comment": "Accepted dependency advisories. Each entry MUST state why it does not apply and when it is next reviewed. Delete entries when the advisory is fixed upstream.",
  "accepted": [
    {
      "advisory": "react-router RSC-mode CSRF",
      "package": "react-router",
      "severity": "high",
      "reason": "Applies only to React Server Components mode. This app is a plain SPA with no RSC and no server rendering. No upstream fix released.",
      "acceptedOn": "2026-08-12",
      "reviewBy": "2026-11-12"
    }
  ]
}
```

- [ ] **Step 4: Write the audit check script**

Create `scripts/audit-check.mjs`:

```js
/**
 * Fails when `npm audit` reports a high/critical advisory that is not in
 * audit-allowlist.json, or when an allowlist entry is past its review date.
 */
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const allowlist = JSON.parse(readFileSync('audit-allowlist.json', 'utf8'));
const today = new Date().toISOString().slice(0, 10);

const stale = allowlist.accepted.filter((a) => a.reviewBy < today);
if (stale.length > 0) {
  console.error('Audit allowlist entries are past review:');
  for (const s of stale) console.error(`  - ${s.advisory} (review was due ${s.reviewBy})`);
  process.exit(1);
}

let report;
try {
  report = JSON.parse(execSync('npm audit --json', { encoding: 'utf8' }));
} catch (err) {
  // npm audit exits non-zero when advisories exist; the JSON is still on stdout.
  report = JSON.parse(err.stdout);
}

const allowedPackages = new Set(allowlist.accepted.map((a) => a.package));
const blocking = Object.values(report.vulnerabilities ?? {}).filter(
  (v) => ['high', 'critical'].includes(v.severity) && !allowedPackages.has(v.name),
);

if (blocking.length > 0) {
  console.error('Unaccepted high/critical advisories:');
  for (const b of blocking) console.error(`  - ${b.name} (${b.severity})`);
  process.exit(1);
}

console.log('Dependency audit clean (allowlist honoured).');
```

- [ ] **Step 5: Add the script and run it**

In root `package.json` scripts, add:

```json
"security:deps": "node scripts/audit-check.mjs"
```

Run: `npm run security:deps`
Expected: `Dependency audit clean (allowlist honoured).`

- [ ] **Step 6: Commit**

```bash
git add .gitleaks.toml audit-allowlist.json scripts/audit-check.mjs package.json
git commit -m "feat(security): secret scanning and dependency audit gate"
```

---

## Task 4: SAST with Semgrep

**Files:**
- Create: `.semgrep.yml`
- Modify: `package.json` (root — `security:sast` script)

- [ ] **Step 1: Create the ruleset config**

Create `.semgrep.yml`:

```yaml
# Rulesets are pulled from the Semgrep registry at run time. Kept narrow so the
# gate stays fast and the signal stays high.
rules: []
extends:
  - p/typescript
  - p/react
  - p/owasp-top-ten
  - p/secrets
paths:
  exclude:
    - "**/dist/**"
    - "**/node_modules/**"
    - "**/*.test.ts"
    - "**/*.test.tsx"
```

- [ ] **Step 2: Add the script**

In root `package.json` scripts, add:

```json
"security:sast": "semgrep --config .semgrep.yml --error --quiet"
```

- [ ] **Step 3: Run it**

Run: `npx semgrep --config .semgrep.yml --error --quiet`
Expected: no findings. If findings appear, fix them. Where a finding is a genuine false positive, add a `// nosemgrep: <rule-id>` comment on the line **with a reason on the line above** — an unexplained suppression is not acceptable.

- [ ] **Step 4: Commit**

```bash
git add .semgrep.yml package.json
git commit -m "feat(security): add Semgrep SAST gate"
```

---

## Task 5: Bundle size budget

A bundle regression is a latency regression. Budget it, and let it ratchet down only.

**Files:**
- Create: `.size-limit.json`
- Modify: `package.json` (root — devDependency and script)

- [ ] **Step 1: Install size-limit**

```bash
npm install -D -w . size-limit@^11 @size-limit/preset-app@^11
```

- [ ] **Step 2: Build and measure the current size**

Run: `npm run build`
Then: `ls -la apps/web/dist/assets/`

Record the gzipped size of the main JS chunk. This measured number is the starting budget — do not invent one.

- [ ] **Step 3: Create the budget file**

Create `.size-limit.json`. Replace `<MEASURED>` with the number from Step 2, rounded up to the next 10 kB.

```json
[
  {
    "name": "web — initial JS",
    "path": "apps/web/dist/assets/*.js",
    "limit": "<MEASURED> kB",
    "gzip": true
  },
  {
    "name": "web — initial CSS",
    "path": "apps/web/dist/assets/*.css",
    "limit": "<MEASURED> kB",
    "gzip": true
  }
]
```

- [ ] **Step 4: Add the script and verify**

In root `package.json` scripts, add:

```json
"size": "size-limit"
```

Run: `npm run size`
Expected: PASS, reporting sizes under budget.

- [ ] **Step 5: Commit**

```bash
git add .size-limit.json package.json package-lock.json
git commit -m "feat(perf): add bundle size budget"
```

---

## Task 6: The AsyncState component

Every async surface must declare its state in a way a test can read. One component, six variants, one data attribute. This is the contract the fault matrix asserts against.

**Files:**
- Create: `apps/web/src/components/ui/AsyncState.tsx`
- Create: `apps/web/src/components/ui/AsyncState.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `apps/web/src/components/ui/AsyncState.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AsyncState } from './AsyncState';

describe('AsyncState', () => {
  it('marks the state kind on the root element', () => {
    const { container } = render(<AsyncState kind="loading" title="Reviewing sources" />);
    expect(container.querySelector('[data-async-state="loading"]')).not.toBeNull();
  });

  it('announces non-loading states assertively', () => {
    render(<AsyncState kind="error" title="Could not reach Caspr" />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('announces loading politely, not as an alert', () => {
    render(<AsyncState kind="loading" title="Working" />);
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('renders a recovery action that is reachable and labelled', async () => {
    const onAct = vi.fn();
    render(
      <AsyncState
        kind="error"
        title="Could not reach Caspr"
        action={{ kind: 'retry', label: 'Try again', onAct }}
      />,
    );
    const button = screen.getByRole('button', { name: 'Try again' });
    expect(button).toHaveAttribute('data-recovery', 'retry');
    button.click();
    expect(onAct).toHaveBeenCalledOnce();
  });

  it('surfaces the wait before retrying when rate limited', () => {
    render(
      <AsyncState kind="rate-limited" title="Too many requests" retryAfterSeconds={30} />,
    );
    expect(screen.getByText(/30 seconds/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test --workspace @caspr/web -- AsyncState`
Expected: FAIL — cannot resolve `./AsyncState`.

- [ ] **Step 3: Write the component**

Create `apps/web/src/components/ui/AsyncState.tsx`:

```tsx
/**
 * The single surface for every non-ready async state. Rendering this component
 * is how a screen declares "I know I am not ready, and here is what the user
 * does about it". The fault matrix (src/test/faultMatrix.test.tsx) asserts that
 * every async path reaches one of these — anything else is an undesigned state.
 *
 * Visual treatment follows the empty/error/loading frames in the Figma
 * dev-readiness set; this file owns the semantics, not the styling decisions.
 */

export type AsyncStateKind =
  | 'loading'
  | 'empty'
  | 'error'
  | 'timeout'
  | 'offline'
  | 'rate-limited';

export interface RecoveryAction {
  /** What the action does, for tests and telemetry. */
  kind: 'retry' | 'back' | 'reload' | 'sign-in' | 'contact';
  label: string;
  onAct: () => void;
}

export interface AsyncStateProps {
  kind: AsyncStateKind;
  title: string;
  detail?: string;
  action?: RecoveryAction;
  /** Seconds until a rate-limited request may be retried (from Retry-After). */
  retryAfterSeconds?: number;
}

export function AsyncState({
  kind,
  title,
  detail,
  action,
  retryAfterSeconds,
}: AsyncStateProps) {
  const isLoading = kind === 'loading';

  return (
    <div
      data-async-state={kind}
      role={isLoading ? 'status' : 'alert'}
      aria-live={isLoading ? 'polite' : 'assertive'}
      className="flex flex-col items-start gap-2 py-8"
    >
      <p className="text-base">{title}</p>
      {detail && <p className="text-sm opacity-70">{detail}</p>}
      {retryAfterSeconds !== undefined && (
        <p className="text-sm opacity-70">
          You can try again in {retryAfterSeconds} seconds.
        </p>
      )}
      {action && (
        <button
          type="button"
          data-recovery={action.kind}
          onClick={action.onAct}
          className="mt-2 underline"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test --workspace @caspr/web -- AsyncState`
Expected: PASS, 5 tests.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/components/ui/AsyncState.tsx apps/web/src/components/ui/AsyncState.test.tsx
git commit -m "feat(ui): add AsyncState — the declared-state contract for async surfaces"
```

---

## Task 7: The fault-injection harness

Wraps `CasprClient` so any operation can be made slow, time out, error, rate-limit, disconnect, or fail offline. This is the engine the matrix runs on.

**Files:**
- Create: `apps/web/src/test/faults.ts`
- Create: `apps/web/src/test/faults.test.ts`

- [ ] **Step 1: Write the failing test**

Create `apps/web/src/test/faults.test.ts`:

```ts
import { afterEach, describe, expect, it, vi } from 'vitest';
import { HttpError, withFault } from './faults';
import type { CasprClient } from '../data/client';

function stubClient(): CasprClient {
  return {
    auth: {
      signInWithPassword: vi.fn().mockResolvedValue({ token: 't' }),
      signInWithGoogle: vi.fn().mockResolvedValue({ token: 't' }),
    },
    analysis: {
      proposeLayout: vi.fn().mockResolvedValue({ sections: [] }),
      triggerGeneration: vi.fn().mockResolvedValue({ analysisId: 'a' }),
      retrieveAnalysis: vi.fn().mockResolvedValue({ analysisId: 'a' }),
      getUploadUrl: vi.fn().mockResolvedValue({ fileId: 'f' }),
      subscribeSourceStream: vi.fn().mockReturnValue(() => {}),
    },
    wallet: { getSnapshot: vi.fn().mockResolvedValue({ balanceCents: 10_000 }) },
  } as unknown as CasprClient;
}

afterEach(() => vi.useRealTimers());

describe('withFault', () => {
  it('passes through untouched operations', async () => {
    const client = withFault(stubClient(), { 'wallet.getSnapshot': 'server-error' });
    await expect(client.auth.signInWithPassword('a@b.c', 'pw')).resolves.toBeDefined();
  });

  it('rejects with a 500 for server-error', async () => {
    const client = withFault(stubClient(), { 'wallet.getSnapshot': 'server-error' });
    await expect(client.wallet.getSnapshot('t')).rejects.toMatchObject({ status: 500 });
  });

  it('rejects with 429 and a Retry-After for rate-limited', async () => {
    const client = withFault(stubClient(), { 'analysis.proposeLayout': 'rate-limited' });
    await expect(client.analysis.proposeLayout('p', 'brief')).rejects.toMatchObject({
      status: 429,
      retryAfterSeconds: 30,
    });
  });

  it('rejects with a network-style error for offline', async () => {
    const client = withFault(stubClient(), { 'analysis.triggerGeneration': 'offline' });
    await expect(
      client.analysis.triggerGeneration({} as never),
    ).rejects.toBeInstanceOf(TypeError);
  });

  it('delays but still resolves for slow', async () => {
    vi.useFakeTimers();
    const client = withFault(stubClient(), { 'wallet.getSnapshot': 'slow' });
    const pending = client.wallet.getSnapshot('t');
    let settled = false;
    void pending.then(() => (settled = true));
    await vi.advanceTimersByTimeAsync(2_000);
    expect(settled).toBe(false);
    await vi.advanceTimersByTimeAsync(1_500);
    await expect(pending).resolves.toBeDefined();
  });

  it('never settles before the timeout threshold, then rejects', async () => {
    vi.useFakeTimers();
    const client = withFault(stubClient(), { 'wallet.getSnapshot': 'timeout' });
    const pending = client.wallet.getSnapshot('t');
    const assertion = expect(pending).rejects.toMatchObject({ status: 408 });
    await vi.advanceTimersByTimeAsync(31_000);
    await assertion;
  });

  it('drops the stream mid-flight for stream-disconnect', () => {
    const onEvent = vi.fn();
    const onError = vi.fn();
    const client = withFault(stubClient(), {
      'analysis.subscribeSourceStream': 'stream-disconnect',
    });
    client.analysis.subscribeSourceStream('a', onEvent, onError);
    expect(onError).toHaveBeenCalledWith(expect.any(Error));
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test --workspace @caspr/web -- faults`
Expected: FAIL — cannot resolve `./faults`.

- [ ] **Step 3: Write the harness**

Create `apps/web/src/test/faults.ts`:

```ts
/**
 * Fault injection at the CasprClient seam.
 *
 * Every network call in the app goes through CasprClient, so wrapping it is the
 * cheapest complete way to exercise failure behaviour: no browser, no network
 * stubbing, deterministic under fake timers. The Playwright suite covers the
 * faults that only exist in a real browser (true offline, real SSE drops).
 */
import type { CasprClient } from '../data/client';

export type FaultKind =
  | 'ok'
  | 'slow'
  | 'timeout'
  | 'server-error'
  | 'rate-limited'
  | 'offline'
  | 'stream-disconnect';

/** Every network-touching operation on the client seam. */
export type Operation =
  | 'auth.signInWithPassword'
  | 'auth.signInWithGoogle'
  | 'analysis.proposeLayout'
  | 'analysis.triggerGeneration'
  | 'analysis.retrieveAnalysis'
  | 'analysis.getUploadUrl'
  | 'analysis.subscribeSourceStream'
  | 'wallet.getSnapshot';

export const OPERATIONS: readonly Operation[] = [
  'auth.signInWithPassword',
  'auth.signInWithGoogle',
  'analysis.proposeLayout',
  'analysis.triggerGeneration',
  'analysis.retrieveAnalysis',
  'analysis.getUploadUrl',
  'analysis.subscribeSourceStream',
  'wallet.getSnapshot',
] as const;

/** A slow-but-successful response. Long enough that a spinner must appear. */
export const SLOW_MS = 3_000;
/** The point at which a request must be abandoned rather than hang forever. */
export const TIMEOUT_MS = 30_000;
/** Matches the Retry-After the backend sends on 429 (contract v4 §7.8). */
export const RATE_LIMIT_RETRY_AFTER_S = 30;

export class HttpError extends Error {
  constructor(
    readonly status: number,
    readonly retryAfterSeconds?: number,
  ) {
    super(`HTTP ${status}`);
    this.name = 'HttpError';
  }
}

function applyFault<T>(kind: FaultKind, call: () => Promise<T>): Promise<T> {
  switch (kind) {
    case 'ok':
    case 'stream-disconnect':
      return call();
    case 'slow':
      return new Promise<void>((resolve) => setTimeout(resolve, SLOW_MS)).then(call);
    case 'timeout':
      return new Promise<T>((_, reject) =>
        setTimeout(() => reject(new HttpError(408)), TIMEOUT_MS),
      );
    case 'server-error':
      return Promise.reject(new HttpError(500));
    case 'rate-limited':
      return Promise.reject(new HttpError(429, RATE_LIMIT_RETRY_AFTER_S));
    case 'offline':
      return Promise.reject(new TypeError('Failed to fetch'));
  }
}

export type FaultPlan = Partial<Record<Operation, FaultKind>>;

/**
 * Returns a client that behaves like `base` except where `plan` names a fault.
 * The original client is not mutated.
 */
export function withFault(base: CasprClient, plan: FaultPlan): CasprClient {
  const kindOf = (op: Operation): FaultKind => plan[op] ?? 'ok';

  const wrapAsync =
    <A extends unknown[], R>(op: Operation, fn: (...args: A) => Promise<R>) =>
    (...args: A): Promise<R> =>
      applyFault(kindOf(op), () => fn(...args));

  const streamOp: Operation = 'analysis.subscribeSourceStream';

  return {
    auth: {
      signInWithPassword: wrapAsync(
        'auth.signInWithPassword',
        base.auth.signInWithPassword.bind(base.auth),
      ),
      signInWithGoogle: wrapAsync(
        'auth.signInWithGoogle',
        base.auth.signInWithGoogle.bind(base.auth),
      ),
    },
    analysis: {
      proposeLayout: wrapAsync(
        'analysis.proposeLayout',
        base.analysis.proposeLayout.bind(base.analysis),
      ),
      triggerGeneration: wrapAsync(
        'analysis.triggerGeneration',
        base.analysis.triggerGeneration.bind(base.analysis),
      ),
      retrieveAnalysis: wrapAsync(
        'analysis.retrieveAnalysis',
        base.analysis.retrieveAnalysis.bind(base.analysis),
      ),
      getUploadUrl: wrapAsync(
        'analysis.getUploadUrl',
        base.analysis.getUploadUrl.bind(base.analysis),
      ),
      subscribeSourceStream: ((
        analysisId: string,
        onEvent: (event: unknown) => void,
        onError?: (error: Error) => void,
      ) => {
        const kind = kindOf(streamOp);
        if (kind === 'stream-disconnect') {
          onError?.(new Error('stream disconnected'));
          return () => {};
        }
        if (kind === 'server-error' || kind === 'offline' || kind === 'timeout') {
          onError?.(new Error(`stream failed: ${kind}`));
          return () => {};
        }
        return base.analysis.subscribeSourceStream(
          analysisId,
          onEvent as never,
          onError as never,
        );
      }) as CasprClient['analysis']['subscribeSourceStream'],
    },
    wallet: {
      getSnapshot: wrapAsync('wallet.getSnapshot', base.wallet.getSnapshot.bind(base.wallet)),
    },
  };
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test --workspace @caspr/web -- faults`
Expected: PASS, 7 tests.

**Note:** `subscribeSourceStream` currently has the signature `(analysisId, onEvent) => () => void` in `apps/web/src/data/client.ts`. This harness requires a third `onError` parameter — a stream that cannot report failure cannot have failure tested. Add it to the interface and to both the mock and real implementations as part of this task, then re-run the full suite.

- [ ] **Step 5: Run the whole suite to confirm no regression**

Run: `npm test`
Expected: all tests pass, including the pre-existing suite.

- [ ] **Step 6: Commit**

```bash
git add apps/web/src/test/faults.ts apps/web/src/test/faults.test.ts apps/web/src/data
git commit -m "feat(test): fault-injection harness at the client seam"
```

---

## Task 8: The fault matrix

The operation × fault table, expanded into tests. **Expect failures.** Each one is a real gap in the product's failure behaviour.

**Files:**
- Create: `apps/web/src/test/designedState.ts`
- Create: `apps/web/src/test/faultMatrix.ts`
- Create: `apps/web/src/test/faultMatrix.test.tsx`

- [ ] **Step 1: Write the assertion helpers**

Create `apps/web/src/test/designedState.ts`:

```ts
import { expect } from 'vitest';
import { screen, waitFor } from '@testing-library/react';

/**
 * Asserts the surface has declared a state the product designed for, rather
 * than sitting in an undeclared one — a spinner that never resolves, or a blank
 * pane. Anything not rendering AsyncState is an undesigned state and fails.
 */
export async function expectDesignedState(
  container: HTMLElement,
  allowed: readonly string[],
): Promise<string> {
  return waitFor(
    () => {
      const el = container.querySelector('[data-async-state]');
      expect(
        el,
        'No designed state rendered. The surface is in an undeclared state — ' +
          'render <AsyncState> for this path.',
      ).not.toBeNull();

      const kind = el!.getAttribute('data-async-state')!;
      expect(
        allowed,
        `Reached state "${kind}", expected one of ${allowed.join(', ')}.`,
      ).toContain(kind);
      return kind;
    },
    { timeout: 5_000 },
  );
}

/** Every non-loading failure state must offer the user a way forward. */
export function expectRecoveryAvailable(container: HTMLElement): void {
  const recovery = container.querySelector('[data-recovery]');
  expect(
    recovery,
    'Failure state offers no recovery action. The user is stuck.',
  ).not.toBeNull();
  expect(screen.getByRole('button', { name: /.+/ })).toBeEnabled();
}
```

- [ ] **Step 2: Write the matrix table**

Create `apps/web/src/test/faultMatrix.ts`:

```ts
import type { FaultKind, Operation } from './faults';

/**
 * The matrix: which faults are meaningful for which operation, which screen
 * exercises that operation, and which designed states are acceptable outcomes.
 *
 * `stream-disconnect` applies only to the stream. Everything else applies to
 * every request-response call. 41 cases in total.
 */
export interface MatrixCase {
  operation: Operation;
  /** The route whose mount triggers this operation. */
  route: string;
  /** Designed states that are an acceptable outcome for this fault. */
  expected: Partial<Record<FaultKind, readonly string[]>>;
  /** True when a failure here must leave the wallet balance untouched. */
  assertNoCharge: boolean;
}

const REQUEST_FAULTS = {
  slow: ['loading'],
  timeout: ['timeout', 'error'],
  'server-error': ['error'],
  'rate-limited': ['rate-limited', 'error'],
  offline: ['offline', 'error'],
} as const;

export const MATRIX: readonly MatrixCase[] = [
  { operation: 'auth.signInWithPassword', route: '/signin', expected: REQUEST_FAULTS, assertNoCharge: false },
  { operation: 'auth.signInWithGoogle', route: '/signin', expected: REQUEST_FAULTS, assertNoCharge: false },
  { operation: 'wallet.getSnapshot', route: '/', expected: REQUEST_FAULTS, assertNoCharge: true },
  { operation: 'analysis.proposeLayout', route: '/compose', expected: REQUEST_FAULTS, assertNoCharge: true },
  { operation: 'analysis.triggerGeneration', route: '/compose', expected: REQUEST_FAULTS, assertNoCharge: true },
  { operation: 'analysis.retrieveAnalysis', route: '/report', expected: REQUEST_FAULTS, assertNoCharge: true },
  { operation: 'analysis.getUploadUrl', route: '/compose', expected: REQUEST_FAULTS, assertNoCharge: true },
  {
    operation: 'analysis.subscribeSourceStream',
    route: '/theater',
    expected: { ...REQUEST_FAULTS, 'stream-disconnect': ['error', 'offline'] },
    assertNoCharge: true,
  },
];
```

- [ ] **Step 3: Write the generated tests**

Create `apps/web/src/test/faultMatrix.test.tsx`:

```tsx
import { render } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MATRIX } from './faultMatrix';
import { withFault, type FaultKind } from './faults';
import { expectDesignedState, expectRecoveryAvailable } from './designedState';
import { ClientProvider } from '../data/ClientContext';
import { createMockClient } from '../data/mockClient';
import { router as appRoutes } from '../app/router';

/**
 * Every async surface, under every failure mode it can meet, must land in a
 * state the product designed for — with a way out, and without charging for
 * work that did not happen.
 *
 * Failures here are not test bugs. They are undesigned states in the product.
 */

function renderAt(route: string, plan: Parameters<typeof withFault>[1]) {
  const client = withFault(createMockClient(), plan);
  const router = createMemoryRouter(appRoutes.routes, { initialEntries: [route] });
  const result = render(
    <ClientProvider client={client}>
      <RouterProvider router={router} />
    </ClientProvider>,
  );
  return { ...result, client };
}

describe('fault matrix', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  for (const testCase of MATRIX) {
    describe(testCase.operation, () => {
      for (const [fault, allowedStates] of Object.entries(testCase.expected)) {
        it(`reaches a designed state under ${fault}`, async () => {
          const { container } = renderAt(testCase.route, {
            [testCase.operation]: fault as FaultKind,
          });

          await vi.advanceTimersByTimeAsync(31_000);

          const reached = await expectDesignedState(container, allowedStates);

          if (reached !== 'loading') {
            expectRecoveryAvailable(container);
          }
        });

        if (testCase.assertNoCharge && fault !== 'slow') {
          it(`does not charge the wallet under ${fault}`, async () => {
            const { client } = renderAt(testCase.route, {
              [testCase.operation]: fault as FaultKind,
            });

            await vi.advanceTimersByTimeAsync(31_000);

            const snapshot = await client.wallet
              .getSnapshot('test-token')
              .catch(() => null);
            if (snapshot) {
              expect(snapshot.balanceCents).toBe(10_000);
            }
          });
        }
      }
    });
  }
});
```

- [ ] **Step 4: Run the matrix**

Run: `npm test --workspace @caspr/web -- faultMatrix`
Expected: **FAIL, in multiple cases.** This is the intended outcome on first run.

- [ ] **Step 5: Triage and record every failure**

For each failing case, record in `QUESTIONS-FOR-JOY.md` under a `## Undesigned states` heading:

```
- [ ] <route> · <operation> · <fault> → currently renders <what happens>, expected <allowed states>
```

- [ ] **Step 6: Fix them, most important journey first**

Order: `analysis.proposeLayout` → `analysis.triggerGeneration` → `analysis.subscribeSourceStream` → `auth.signInWithPassword` → `wallet.getSnapshot` → the rest. That is the activation path in sequence.

For each, render `<AsyncState>` with the right `kind` and a recovery action on the failing path. Re-run after each fix.

- [ ] **Step 7: Verify the matrix is green**

Run: `npm test --workspace @caspr/web -- faultMatrix`
Expected: PASS, 41 state cases plus the no-charge cases.

- [ ] **Step 8: Commit**

```bash
git add apps/web/src/test apps/web/src/features apps/web/src/pages
git commit -m "feat(test): fault matrix — every async path reaches a designed state"
```

---

## Task 9: Playwright setup and smoke test

**Files:**
- Create: `e2e/playwright.config.ts`
- Create: `e2e/fixtures.ts`
- Create: `e2e/journeys/smoke.spec.ts`
- Modify: `package.json` (root — devDependency and scripts)
- Modify: `.gitignore`

- [ ] **Step 1: Install Playwright**

```bash
npm install -D -w . @playwright/test@^1.50
npx playwright install --with-deps chromium firefox webkit
```

- [ ] **Step 2: Create the config**

Create `e2e/playwright.config.ts`:

```ts
import { defineConfig, devices } from '@playwright/test';

/**
 * Target comes from the environment, never from code — the same suite runs
 * against a local dev server, staging and production.
 */
const baseURL = process.env.TEST_BASE_URL ?? 'http://127.0.0.1:5173';
const isLocal = !process.env.TEST_BASE_URL;

export default defineConfig({
  testDir: '.',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI
    ? [['html', { outputFolder: '../playwright-report' }], ['list']]
    : [['list']],
  use: {
    baseURL,
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile', use: { ...devices['iPhone 14'] } },
  ],
  webServer: isLocal
    ? {
        command: 'npm run dev --workspace @caspr/web',
        url: 'http://127.0.0.1:5173',
        reuseExistingServer: true,
        timeout: 120_000,
      }
    : undefined,
});
```

- [ ] **Step 3: Add scripts and ignore artifacts**

In root `package.json` scripts, add:

```json
"e2e": "playwright test --config e2e/playwright.config.ts",
"e2e:ui": "playwright test --config e2e/playwright.config.ts --ui"
```

Append to `.gitignore`:

```
playwright-report/
test-results/
```

- [ ] **Step 4: Write the smoke test**

Create `e2e/journeys/smoke.spec.ts`:

```ts
import { expect, test } from '@playwright/test';

test('the app loads with no console errors and no undesigned state', async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', (err) => consoleErrors.push(err.message));

  await page.goto('/');

  await expect(page.locator('body')).toBeVisible();
  await expect(page.locator('[data-async-state="error"]')).toHaveCount(0);
  expect(consoleErrors, `Console errors: ${consoleErrors.join(' | ')}`).toHaveLength(0);
});
```

- [ ] **Step 5: Run it**

Run: `npm run e2e -- --project=chromium smoke`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add e2e package.json package-lock.json .gitignore
git commit -m "feat(e2e): Playwright setup and smoke test"
```

---

## Task 10: The activation journey

The path that decides whether a signup becomes a customer. Test it end to end.

**Files:**
- Create: `e2e/journeys/activation.spec.ts`

- [ ] **Step 1: Write the test**

Create `e2e/journeys/activation.spec.ts`:

```ts
import { expect, test } from '@playwright/test';

/**
 * Signup → prompt → layout proposal → refine → gate → Theater → report.
 * This is the Aha! path. Every step asserts arrival at a real state, not the
 * mere absence of an error.
 */
test.describe('activation journey', () => {
  test('a new user reaches a finished report', async ({ page }) => {
    await page.goto('/signin');

    await page.getByLabel(/email/i).fill('test@caspr.ai');
    await page.getByLabel(/password/i).fill('correct-horse-battery');
    await page.getByRole('button', { name: /sign in/i }).click();

    // The free trial balance is the first thing a new user must see.
    await expect(page.getByText('$100.00')).toBeVisible({ timeout: 10_000 });

    await page.goto('/compose');
    await page
      .getByRole('textbox')
      .first()
      .fill('Market size and competitive landscape for EV charging in Germany');
    await page.keyboard.press('Enter');

    // Layout proposal must appear as sections the user can read, not a spinner.
    await expect(page.getByTestId('layout-section').first()).toBeVisible({
      timeout: 15_000,
    });
    const sectionCount = await page.getByTestId('layout-section').count();
    expect(sectionCount).toBeGreaterThan(0);

    await page.getByRole('button', { name: /generate/i }).click();

    // Theater must actually animate — a static SVG is a dead state.
    const theater = page.locator('[data-theater]');
    await expect(theater).toBeVisible({ timeout: 10_000 });
    const firstCount = await page.locator('[data-source-count]').textContent();
    await page.waitForTimeout(3_000);
    const laterCount = await page.locator('[data-source-count]').textContent();
    expect(laterCount).not.toBe(firstCount);

    // The report arrives, with its citations and a chart.
    await expect(page.getByTestId('report-section').first()).toBeVisible({
      timeout: 60_000,
    });
    await expect(page.locator('[data-red-dot]').first()).toBeVisible();
    await expect(page.locator('[data-chart]').first()).toBeVisible();
  });

  test('a red dot explains itself without a network round trip', async ({ page }) => {
    const requests: string[] = [];
    page.on('request', (req) => requests.push(req.url()));

    await page.goto('/report');
    await expect(page.locator('[data-red-dot]').first()).toBeVisible({ timeout: 20_000 });

    requests.length = 0;
    await page.locator('[data-red-dot]').first().click();

    await expect(page.getByTestId('anchor-explanation')).toBeVisible();
    expect(
      requests.filter((u) => !u.startsWith('data:')),
      `Red dot made network calls: ${requests.join(', ')}`,
    ).toHaveLength(0);
  });
});
```

- [ ] **Step 2: Run it**

Run: `npm run e2e -- --project=chromium activation`
Expected: FAIL on the first run wherever the required `data-*` hooks are missing.

- [ ] **Step 3: Add the missing test hooks to the product**

Add these attributes where they belong. They are stable contracts for tests, not styling:

| Attribute | Component |
|---|---|
| `data-testid="layout-section"` | `apps/web/src/features/layout/LayoutSectionCard.tsx` |
| `data-theater` | `apps/web/src/features/theater/Theater.tsx` root |
| `data-source-count` | the counter element in `Theater.tsx` |
| `data-testid="report-section"` | `apps/web/src/features/reader/ReportReader.tsx` section wrapper |
| `data-red-dot` | `apps/web/src/features/reader/RedDot.tsx` trigger |
| `data-testid="anchor-explanation"` | `RedDot.tsx` expanded explanation |
| `data-chart` | `apps/web/src/features/chart/EChart.tsx` container |

- [ ] **Step 4: Re-run until green**

Run: `npm run e2e -- --project=chromium activation`
Expected: PASS, 2 tests.

- [ ] **Step 5: Run across all browsers**

Run: `npm run e2e -- activation`
Expected: PASS on chromium, firefox, webkit, mobile. Fix any browser-specific failures — WebKit in particular is strict about SSE and date parsing.

- [ ] **Step 6: Commit**

```bash
git add e2e/journeys/activation.spec.ts apps/web/src
git commit -m "feat(e2e): activation journey end to end"
```

---

## Task 11: Wallet and auth journeys

Money and identity. Both need to be right before anything else matters.

**Files:**
- Create: `e2e/journeys/wallet.spec.ts`
- Create: `e2e/journeys/auth.spec.ts`

- [ ] **Step 1: Write the wallet journey**

Create `e2e/journeys/wallet.spec.ts`:

```ts
import { expect, test } from '@playwright/test';

async function signIn(page: import('@playwright/test').Page) {
  await page.goto('/signin');
  await page.getByLabel(/email/i).fill('test@caspr.ai');
  await page.getByLabel(/password/i).fill('correct-horse-battery');
  await page.getByRole('button', { name: /sign in/i }).click();
  await expect(page.getByText(/\$\d/)).toBeVisible({ timeout: 10_000 });
}

test.describe('wallet', () => {
  test('a new account starts on the $100 free trial', async ({ page }) => {
    await signIn(page);
    await expect(page.getByText('$100.00')).toBeVisible();
  });

  test('the balance survives a reload', async ({ page }) => {
    await signIn(page);
    const before = await page.getByTestId('wallet-balance').textContent();
    await page.reload();
    await expect(page.getByTestId('wallet-balance')).toHaveText(before!);
  });

  test('the gate states the price before any money moves', async ({ page }) => {
    await signIn(page);
    await page.goto('/gate');
    await expect(page.getByTestId('gate-price')).toBeVisible();
    const price = await page.getByTestId('gate-price').textContent();
    expect(price).toMatch(/\$\d+/);
    // Nothing is charged until the user confirms at the gate.
    await expect(page.getByTestId('wallet-balance')).toHaveText('$100.00');
  });
});
```

- [ ] **Step 2: Write the auth journey**

Create `e2e/journeys/auth.spec.ts`:

```ts
import { expect, test } from '@playwright/test';

test.describe('auth', () => {
  test('a session persists across a reload', async ({ page }) => {
    await page.goto('/signin');
    await page.getByLabel(/email/i).fill('test@caspr.ai');
    await page.getByLabel(/password/i).fill('correct-horse-battery');
    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(page.getByTestId('wallet-balance')).toBeVisible({ timeout: 10_000 });

    await page.reload();
    await expect(page.getByTestId('wallet-balance')).toBeVisible();
  });

  test('signing out clears the session and the stored token', async ({ page, context }) => {
    await page.goto('/signin');
    await page.getByLabel(/email/i).fill('test@caspr.ai');
    await page.getByLabel(/password/i).fill('correct-horse-battery');
    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(page.getByTestId('wallet-balance')).toBeVisible({ timeout: 10_000 });

    await page.getByRole('button', { name: /sign out/i }).click();
    await expect(page.getByTestId('wallet-balance')).toHaveCount(0);

    const storage = await context.storageState();
    const origin = storage.origins[0];
    const tokenEntries = (origin?.localStorage ?? []).filter((e) =>
      /token|session|auth/i.test(e.name),
    );
    expect(tokenEntries, 'Auth material survived sign-out').toHaveLength(0);
  });

  test('bad credentials produce a designed error, not a hang', async ({ page }) => {
    await page.goto('/signin');
    await page.getByLabel(/email/i).fill('test@caspr.ai');
    await page.getByLabel(/password/i).fill('wrong-password');
    await page.getByRole('button', { name: /sign in/i }).click();

    await expect(page.locator('[data-async-state="error"]')).toBeVisible({
      timeout: 10_000,
    });
    await expect(page.locator('[data-recovery]')).toBeVisible();
  });
});
```

- [ ] **Step 3: Run both, adding `data-testid="wallet-balance"` and `data-testid="gate-price"` where missing**

Add `data-testid="wallet-balance"` to `apps/web/src/features/wallet/WalletBadge.tsx` and `data-testid="gate-price"` to the price element in `apps/web/src/features/gate/GateBlock.tsx`.

Run: `npm run e2e -- --project=chromium wallet auth`
Expected: PASS, 6 tests.

- [ ] **Step 4: Commit**

```bash
git add e2e/journeys apps/web/src/features
git commit -m "feat(e2e): wallet and auth journeys"
```

---

## Task 12: Documents, export and coming-soon journeys

Build rule 8: coming-soon means the real screen with its coming-soon treatment. No dead links. That is testable.

**Files:**
- Create: `e2e/journeys/documents.spec.ts`
- Create: `e2e/journeys/comingSoon.spec.ts`

- [ ] **Step 1: Write the documents and export journey**

Create `e2e/journeys/documents.spec.ts`:

```ts
import { expect, test } from '@playwright/test';

async function signIn(page: import('@playwright/test').Page) {
  await page.goto('/signin');
  await page.getByLabel(/email/i).fill('test@caspr.ai');
  await page.getByLabel(/password/i).fill('correct-horse-battery');
  await page.getByRole('button', { name: /sign in/i }).click();
  await expect(page.getByTestId('wallet-balance')).toBeVisible({ timeout: 10_000 });
}

test.describe('documents', () => {
  test('a valid file attaches and is listed', async ({ page }) => {
    await signIn(page);
    await page.goto('/compose');

    await page.getByTestId('file-input').setInputFiles({
      name: 'market-brief.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('%PDF-1.4 test fixture'),
    });

    await expect(page.getByText('market-brief.pdf')).toBeVisible();
  });

  test('an oversized file is refused with a designed state', async ({ page }) => {
    await signIn(page);
    await page.goto('/compose');

    // Validation limit is 25MB (apps/web/src/features/upload/validate.ts).
    await page.getByTestId('file-input').setInputFiles({
      name: 'too-big.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.alloc(26 * 1024 * 1024),
    });

    await expect(page.locator('[data-async-state="error"]')).toBeVisible();
    await expect(page.getByText(/25\s*MB/i)).toBeVisible();
  });

  test('an unsupported file type is refused with a designed state', async ({ page }) => {
    await signIn(page);
    await page.goto('/compose');

    await page.getByTestId('file-input').setInputFiles({
      name: 'payload.exe',
      mimeType: 'application/x-msdownload',
      buffer: Buffer.from('MZ'),
    });

    await expect(page.locator('[data-async-state="error"]')).toBeVisible();
  });
});

test.describe('export', () => {
  test('a report exports to PDF', async ({ page }) => {
    await signIn(page);
    await page.goto('/report');
    await expect(page.getByTestId('report-section').first()).toBeVisible({
      timeout: 20_000,
    });

    const download = page.waitForEvent('download', { timeout: 60_000 });
    await page.getByTestId('export-pdf').click();
    const file = await download;

    expect(file.suggestedFilename()).toMatch(/\.pdf$/i);
  });

  test('a report exports to PPTX', async ({ page }) => {
    await signIn(page);
    await page.goto('/report');
    await expect(page.getByTestId('report-section').first()).toBeVisible({
      timeout: 20_000,
    });

    const download = page.waitForEvent('download', { timeout: 60_000 });
    await page.getByTestId('export-pptx').click();
    const file = await download;

    expect(file.suggestedFilename()).toMatch(/\.pptx$/i);
  });
});
```

- [ ] **Step 2: Write the coming-soon journey**

Create `e2e/journeys/comingSoon.spec.ts`:

```ts
import { expect, test } from '@playwright/test';

/**
 * Build rule 8: a coming-soon surface is the real screen with its coming-soon
 * treatment. Users should see what is coming. No dead links, no 404s, and no
 * enabled control that leads nowhere.
 */
const COMING_SOON_ROUTES = ['/insights', '/updates'];

test.describe('coming-soon surfaces', () => {
  for (const route of COMING_SOON_ROUTES) {
    test(`${route} renders its coming-soon state, not a 404`, async ({ page }) => {
      const response = await page.goto(route);
      expect(response?.status()).toBeLessThan(400);

      await expect(page.getByTestId('coming-soon')).toBeVisible();
      await expect(page.getByTestId('not-found')).toHaveCount(0);
    });
  }

  test('Intelligence depth is visible but not selectable', async ({ page }) => {
    await page.goto('/gate');

    const intelligence = page.getByTestId('depth-intelligence');
    await expect(intelligence).toBeVisible();
    await expect(intelligence).toBeDisabled();
  });

  test('no navigation destination leads to a 404', async ({ page }) => {
    await page.goto('/');

    const links = await page.getByRole('link').all();
    const hrefs = (await Promise.all(links.map((l) => l.getAttribute('href'))))
      .filter((h): h is string => !!h && h.startsWith('/'));

    for (const href of hrefs) {
      const response = await page.goto(href);
      expect(response?.status(), `${href} returned ${response?.status()}`).toBeLessThan(400);
      await expect(page.getByTestId('not-found'), `${href} rendered NotFound`).toHaveCount(0);
    }
  });
});
```

- [ ] **Step 3: Add the missing test hooks**

| Attribute | Component |
|---|---|
| `data-testid="file-input"` | the `<input type="file">` in `apps/web/src/features/upload/FileUpload.tsx` |
| `data-testid="export-pdf"` / `data-testid="export-pptx"` | the export controls in `apps/web/src/features/reader/ReportReader.tsx` |
| `data-testid="coming-soon"` | the shared coming-soon treatment component |
| `data-testid="not-found"` | root of `apps/web/src/pages/NotFoundPage.tsx` |
| `data-testid="depth-intelligence"` | the Intelligence option in `apps/web/src/features/gate/GateBlock.tsx` |

- [ ] **Step 4: Run both**

Run: `npm run e2e -- --project=chromium documents comingSoon`
Expected: PASS, 8 tests. A `/insights` or `/updates` 404 means the route is missing from `apps/web/src/app/router.tsx` — add it pointing at the coming-soon screen rather than deleting the test.

- [ ] **Step 5: Commit**

```bash
git add e2e/journeys apps/web/src
git commit -m "feat(e2e): documents, export and coming-soon journeys"
```

---

## Task 13: Accessibility

**Files:**
- Create: `e2e/a11y/accessibility.spec.ts`
- Modify: `package.json` (root — devDependency)

- [ ] **Step 1: Install axe**

```bash
npm install -D -w . @axe-core/playwright@^4.10
```

- [ ] **Step 2: Write the test**

Create `e2e/a11y/accessibility.spec.ts`:

```ts
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

/** Public routes. Signed-in routes are covered by the journey specs. */
const ROUTES = [
  '/',
  '/signin',
  '/signup',
  '/compose',
  '/conversation',
  '/layout',
  '/gate',
  '/theater',
  '/report',
  '/welcome',
  '/forgot-password',
];

for (const route of ROUTES) {
  test(`${route} has no WCAG 2.2 AA violations`, async ({ page }) => {
    await page.goto(route);
    await page.waitForLoadState('networkidle');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();

    const summary = results.violations
      .map((v) => `${v.id} (${v.nodes.length}): ${v.help}`)
      .join('\n');

    expect(results.violations, `\n${summary}`).toEqual([]);
  });
}
```

- [ ] **Step 3: Run it**

Run: `npm run e2e -- --project=chromium a11y`
Expected: FAIL with a list of violations. Common causes: missing form labels, insufficient contrast, missing `alt`, unlabelled icon buttons.

- [ ] **Step 4: Fix every violation**

Fix in the product, not by narrowing the rule set. Contrast failures against the brand palette go to `QUESTIONS-FOR-JOY.md` rather than being silently changed — the palette is a locked brand decision.

- [ ] **Step 5: Verify green**

Run: `npm run e2e -- --project=chromium a11y`
Expected: PASS, 11 tests.

- [ ] **Step 6: Commit**

```bash
git add e2e/a11y package.json package-lock.json apps/web/src
git commit -m "feat(e2e): WCAG 2.2 AA accessibility gate"
```

---

## Task 14: Interaction latency budgets

"No lag" made measurable.

**Files:**
- Create: `e2e/perf/interaction.spec.ts`

- [ ] **Step 1: Write the test**

Create `e2e/perf/interaction.spec.ts`:

```ts
import { expect, test } from '@playwright/test';

/**
 * Budgets from the testing apparatus spec §5 T3. These measure the interactions
 * the product promises feel instant. Run on chromium only — cross-browser
 * timing variance makes these flaky elsewhere and adds no signal.
 */
test.describe('interaction latency', () => {
  test.skip(({ browserName }) => browserName !== 'chromium', 'timing: chromium only');

  test('the drawer opens within 100ms', async ({ page }) => {
    await page.goto('/');
    const trigger = page.getByTestId('drawer-trigger');
    await expect(trigger).toBeVisible();

    const start = Date.now();
    await trigger.click();
    await expect(page.getByTestId('drawer')).toBeVisible();
    expect(Date.now() - start).toBeLessThan(100);
  });

  test('a layout skeleton appears within 300ms of submitting a prompt', async ({ page }) => {
    await page.goto('/compose');
    await page.getByRole('textbox').first().fill('EV charging in Germany');

    const start = Date.now();
    await page.keyboard.press('Enter');
    await expect(page.getByTestId('layout-skeleton')).toBeVisible();
    expect(Date.now() - start).toBeLessThan(300);
  });

  test('a chart re-renders within 200ms of switching type', async ({ page }) => {
    await page.goto('/report');
    await expect(page.locator('[data-chart]').first()).toBeVisible({ timeout: 20_000 });

    const start = Date.now();
    await page.getByTestId('chart-type-switch').first().click();
    await page.getByRole('option', { name: /donut/i }).click();
    await expect(page.locator('[data-chart] canvas, [data-chart] svg')).toBeVisible();
    expect(Date.now() - start).toBeLessThan(200);
  });
});
```

- [ ] **Step 2: Run it, adding the missing hooks**

Add `data-testid="drawer-trigger"` and `data-testid="drawer"` in `apps/web/src/app/shell/Drawer.tsx`, `data-testid="layout-skeleton"` in `apps/web/src/pages/LayoutCanvasPage.tsx`, and `data-testid="chart-type-switch"` in `apps/web/src/features/chart/ChartView.tsx`.

Run: `npm run e2e -- --project=chromium interaction`
Expected: PASS, 3 tests. A budget failure is a real performance problem — profile and fix it rather than raising the number.

- [ ] **Step 3: Commit**

```bash
git add e2e/perf apps/web/src
git commit -m "feat(perf): interaction latency budgets"
```

---

## Task 15: Lighthouse CI page budgets

**Files:**
- Create: `lighthouserc.json`
- Modify: `package.json` (root — devDependency and script)

- [ ] **Step 1: Install Lighthouse CI**

```bash
npm install -D -w . @lhci/cli@^0.14
```

- [ ] **Step 2: Create the budget config**

Create `lighthouserc.json`:

```json
{
  "ci": {
    "collect": {
      "staticDistDir": "apps/web/dist",
      "url": ["http://localhost/index.html"],
      "numberOfRuns": 3
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 0.95 }],
        "categories:best-practices": ["error", { "minScore": 0.9 }],
        "largest-contentful-paint": ["error", { "maxNumericValue": 2000 }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.05 }],
        "total-blocking-time": ["error", { "maxNumericValue": 200 }]
      }
    },
    "upload": { "target": "filesystem", "outputDir": "./lighthouse-report" }
  }
}
```

- [ ] **Step 3: Add the script and ignore the report**

In root `package.json` scripts, add:

```json
"perf:lighthouse": "lhci autorun --config=lighthouserc.json"
```

Append to `.gitignore`:

```
lighthouse-report/
.lighthouseci/
```

- [ ] **Step 4: Build and run**

Run: `npm run build && npm run perf:lighthouse`
Expected: PASS. If an assertion fails, fix the cause. Do not relax a threshold without recording the reason in `QUESTIONS-FOR-JOY.md`.

- [ ] **Step 5: Commit**

```bash
git add lighthouserc.json package.json package-lock.json .gitignore
git commit -m "feat(perf): Lighthouse CI page budgets"
```

---

## Task 16: Theater memory soak

The Theater is a long-running SVG animation loop. Leaks there degrade every session that reaches generation.

**Files:**
- Create: `e2e/perf/soak.spec.ts`

- [ ] **Step 1: Write the test**

Create `e2e/perf/soak.spec.ts`:

```ts
import { expect, test } from '@playwright/test';

/**
 * Nightly only — 30 minutes of continuous Theater animation, watching the JS
 * heap. Heap must be flat after warm-up; sustained growth is a leak.
 * Tagged @soak so the PR gate skips it.
 */
test.describe('@soak Theater memory', () => {
  test.skip(({ browserName }) => browserName !== 'chromium', 'CDP: chromium only');
  test.setTimeout(35 * 60_000);

  test('heap does not grow over a 30-minute session', async ({ page }) => {
    await page.goto('/theater');
    await expect(page.locator('[data-theater]')).toBeVisible();

    const cdp = await page.context().newCDPSession(page);
    await cdp.send('HeapProfiler.enable');

    const sample = async (): Promise<number> => {
      await cdp.send('HeapProfiler.collectGarbage');
      const { result } = await cdp.send('Runtime.evaluate', {
        expression: 'performance.memory.usedJSHeapSize',
        returnByValue: true,
      });
      return result.value as number;
    };

    // Five minutes of warm-up before the baseline — caches and fonts settle.
    await page.waitForTimeout(5 * 60_000);
    const baseline = await sample();

    const samples: number[] = [];
    for (let i = 0; i < 5; i++) {
      await page.waitForTimeout(5 * 60_000);
      samples.push(await sample());
    }

    const final = samples[samples.length - 1];
    const growthRatio = final / baseline;

    expect(
      growthRatio,
      `Heap grew ${((growthRatio - 1) * 100).toFixed(1)}% over 25 min. ` +
        `Samples: ${samples.map((s) => Math.round(s / 1e6) + 'MB').join(', ')}`,
    ).toBeLessThan(1.2);
  });
});
```

- [ ] **Step 2: Run it once to establish it works**

Run: `npm run e2e -- --project=chromium soak`
Expected: PASS after ~30 minutes. If it fails, the leak is real — profile the Theater's effect cleanup, particularly the animation frame loop and stream subscription in `useTheater.ts`.

- [ ] **Step 3: Commit**

```bash
git add e2e/perf/soak.spec.ts
git commit -m "feat(perf): Theater memory soak test"
```

---

## Task 17: CI wiring

Everything above becomes a gate, and failures produce a triage bundle rather than a bare red X.

**Files:**
- Modify: `bitbucket-pipelines.yml`

- [ ] **Step 1: Replace the pipeline file**

Replace the contents of `bitbucket-pipelines.yml`:

```yaml
# Gate: static → unit+matrix → build → e2e. Nothing reaches production without
# all four green. Every environment-specific value is a Bitbucket repository
# variable — nothing environment-specific is committed.
image: node:24

definitions:
  caches:
    npmcache: ~/.npm
    playwright: ~/.cache/ms-playwright

  steps:
    - step: &static
        name: Static gate — lint, secrets, deps, SAST
        caches: [npmcache]
        script:
          - npm ci
          - npm run lint
          - npm run typecheck
          - npm run security:deps
          - pipe: atlassian/git-secrets-scan:2.1.0
          - npx semgrep --config .semgrep.yml --error --quiet

    - step: &unit
        name: Unit, contract and fault matrix
        caches: [npmcache]
        script:
          - npm ci
          - npm test
        artifacts:
          - coverage/**

    - step: &buildstep
        name: Build and size budget
        caches: [npmcache]
        script:
          - npm ci
          - npm run build
          - npm run size
        artifacts:
          - apps/web/dist/**

    - step: &e2e
        name: E2E — journeys, a11y, interaction
        image: mcr.microsoft.com/playwright:v1.50.0-noble
        caches: [npmcache, playwright]
        script:
          - npm ci
          - npm run e2e -- --grep-invert @soak
        after-script:
          # Triage bundle: trace, video, screenshots and the HTML report.
          # Diagnosis reads this instead of re-deriving the failure from source.
          - echo "Artifacts attached for triage — traces, video, screenshots."
        artifacts:
          - playwright-report/**
          - test-results/**

    - step: &lighthouse
        name: Lighthouse budgets
        caches: [npmcache]
        script:
          - npm ci
          - npm run build
          - npm run perf:lighthouse
        artifacts:
          - lighthouse-report/**

pipelines:
  pull-requests:
    '**':
      - parallel:
          - step: *static
          - step: *unit
      - step: *buildstep
      - step: *e2e

  branches:
    main:
      - parallel:
          - step: *static
          - step: *unit
      - step: *buildstep
      - step: *e2e
      - step: *lighthouse
      - step:
          name: Deploy web → S3 + CloudFront
          deployment: production
          trigger: manual
          script:
            - npm ci
            - npm run build
            - pipe: atlassian/aws-s3-deploy:1.6.1
              variables:
                AWS_ACCESS_KEY_ID: $AWS_ACCESS_KEY_ID
                AWS_SECRET_ACCESS_KEY: $AWS_SECRET_ACCESS_KEY
                AWS_DEFAULT_REGION: $AWS_DEFAULT_REGION
                S3_BUCKET: $WEB_S3_BUCKET
                LOCAL_PATH: 'apps/web/dist'
                ACL: 'private'
            - pipe: atlassian/aws-cloudfront-invalidate:0.10.0
              variables:
                AWS_ACCESS_KEY_ID: $AWS_ACCESS_KEY_ID
                AWS_SECRET_ACCESS_KEY: $AWS_SECRET_ACCESS_KEY
                AWS_DEFAULT_REGION: $AWS_DEFAULT_REGION
                DISTRIBUTION_ID: $WEB_CLOUDFRONT_DISTRIBUTION_ID

  custom:
    nightly:
      - step: *static
      - step: *unit
      - step: *buildstep
      - step:
          name: Nightly deep — soak and full browser matrix
          image: mcr.microsoft.com/playwright:v1.50.0-noble
          caches: [npmcache, playwright]
          script:
            - npm ci
            - npm run e2e
          artifacts:
            - playwright-report/**
            - test-results/**
      - step: *lighthouse
```

- [ ] **Step 2: Schedule the nightly pipeline**

In Bitbucket: Repository settings → Pipelines → Schedules → New schedule. Branch `main`, pipeline `custom: nightly`, daily at 02:00 UTC.

This is a UI action; there is no file to commit for it.

- [ ] **Step 3: Verify the pipeline locally before pushing**

Run each gate command in sequence and confirm all pass:

```bash
npm run lint && npm run typecheck && npm run security:deps && npm test && npm run build && npm run size
```

Expected: all exit 0.

- [ ] **Step 4: Commit**

```bash
git add bitbucket-pipelines.yml
git commit -m "ci: wire static gate, unit, matrix, e2e and nightly deep suite"
```

- [ ] **Step 5: Push and confirm the pipeline runs green**

```bash
git push
```

Open the Bitbucket pipeline for the pushed branch. Expected: static, unit, build and e2e all green. Fix anything that passes locally but fails in CI — usually a missing environment variable or a timing assumption that does not hold on slower CI hardware.

---

## Phase 1 exit criteria

Phase 1 is complete when all of the following are true:

- [ ] `npm run lint` passes, including `caspr/no-hardcoded-origin` across all product code
- [ ] `npm run security:deps` passes with a documented, in-date allowlist
- [ ] Semgrep reports no findings, or every suppression carries a written reason
- [ ] The fault matrix is green — 41 state cases plus the no-charge cases
- [ ] Every undesigned state found in Task 8 is either fixed or recorded in `QUESTIONS-FOR-JOY.md` with a decision from Joy
- [ ] The activation journey passes on chromium, firefox, webkit and mobile
- [ ] Wallet, auth, documents, export and coming-soon journeys pass
- [ ] No navigation destination anywhere in the app 404s or renders NotFound
- [ ] Accessibility passes WCAG 2.2 AA on all 11 routes
- [ ] Interaction latency budgets pass
- [ ] Lighthouse budgets pass
- [ ] The soak test has run green at least once
- [ ] The CI pipeline is green on `main` and the nightly schedule is configured

---

## What Phase 1 deliberately does not cover

Recorded so nothing is assumed complete that is not:

| Not covered | Phase |
|---|---|
| Contract conformance against Jayant's real API | 3 |
| Load testing to the 500-concurrent target | 2 (stubbed), 3 (real) |
| Active security scanning — ZAP, Nuclei, Schemathesis | 2–3, needs written authorization |
| Prompt injection and model extraction testing | 3 |
| GDPR operational tests — DSAR, deletion, residency | 3 |
| Output quality evaluation | 3 |
| Production monitoring, runbook and escalation | 5 |
| The dashboard | 5 |

---

*Plan: `docs/superpowers/plans/2026-08-12-testing-phase-1.md`*
*Spec: `docs/superpowers/specs/2026-08-12-product-testing-apparatus-design.md`*
*Target repo: `caspr-app`*
