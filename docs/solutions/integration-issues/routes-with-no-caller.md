---
title: Routes with no caller, callers with no route
date: 2026-08-25
category: integration-issues
module: client-seam
problem_type: integration_issue
component: service_object
symptoms:
  - The only action in the product that spends money posted into a 404 for weeks
  - Memories were recorded to localStorage and never reached the server, so the persona was composed from an empty table
  - Change password, change name and change email were built on the server and unreachable from the client
  - Nothing was observable, because both test suites were green throughout
root_cause: missing_workflow_step
resolution_type: code_fix
severity: critical
tags: [api-seam, dead-code, integration-testing, mocks, route-audit, fastapi, react]
---

# Routes with no caller, callers with no route

## Problem

A route with no caller and a caller with no route are the same defect wearing two faces, and neither side's test suite can see either one. The client declares a method, the server declares a handler, and nothing checks that the two ends meet. Three instances were found in Caspr in a single session — not by a failing test, but by diffing every backend route against every client call.

**Instance 1 — the caller with no route.** `client.wallet.reserve()` posted to `POST /wallet/reservations`. That route did not exist on the backend. `WalletService.reserve()` in `src/app/wallet/service.py` was written, reviewed and covered by tests; nothing was ever mounted in front of it. The gate's commit — the only action in the product that spends money — posted into a 404 for weeks, and the client's error handling reported it as a generic failure.

**Instance 2 — the routes with no caller.** `useProfile`, `useRemember` and `useForget` in `apps/web/src/features/profile/queries.ts` were written, typed and covered, and no code path called any of them. Every memory the engagement engine recorded went to `localStorage` and stopped there. The visible cost was a user switching device losing everything Caspr had learned. The invisible and far worse cost: `src/app/profile/persona.py` composes the `user_persona` sent to the analysis engine on every run out of `user_memories` rows — rows nothing was writing. **Personalisation was not degraded, it was absent**, and nothing anywhere would have reported it, because each side was internally correct.

**Instance 3 — the whole Account editing surface.** `PATCH /auth/me`, `POST /auth/me/password`, `POST /auth/me/email-change` and `POST /auth/me/email-change/confirm` were all built, routed and tested on the backend. On the frontend the `AuthApi` seam in `apps/web/src/data/client.ts` declared no method for any of them, `CardField` had no `value`/`onChange` so nothing could read what was typed, and `CardButton` had no `onClick`. Change password, change name and change email were scenery. The change-email card was the worst of the three: you typed an address into an input nothing could read, pressed *Send verification link*, and got the "Check your inbox" confirmation — for an email never sent, to an address nobody had captured.

## Symptoms

The defining symptom is that **there is none**. That is the whole difficulty.

- Both suites green. Backend coverage high, frontend coverage high, CI passing on every commit through the entire window.
- No type error. TypeScript checks `client.wallet.reserve()` against the `WalletApi` interface, which existed and was correct. An interface is a promise about the *client*, and says nothing about what is mounted on the server.
- No lint or dead-code warning. `useRemember` is exported, so nothing calls it unused. An exported symbol with no importer looks identical to a public API.
- The one runtime signal — a 404 on the reserve POST — was caught by generic error handling and surfaced as an ordinary failure, indistinguishable from a network blip.
- The Account cards *looked* correct and were even confirmation-toasted, so manual QA passed them. A success message is not evidence of a request.

## What Didn't Work

**Relying on the backend suite.** It exercised `WalletService.reserve()` directly, as a service object. Every assertion about reservation arithmetic passed. The absent route was invisible to a test that never went through HTTP — the method under test does not know whether anything is mounted in front of it.

**Relying on the frontend suite.** It ran against `mockClient.ts`, which implemented every method on the seam. A mock that answers every call is a mock every client passes against. The mock is a model of the seam declaration, not of the server, so it reproduces the declaration's mistakes faithfully.

**Coverage numbers.** Both sides were well covered, and coverage is precisely the wrong instrument here: it measures whether a line was executed, and every one of these lines *was* executed — by a test. `useRemember` had a passing unit test. `WalletService.reserve` had passing unit tests. Coverage cannot distinguish "called by production code" from "called only by its own test", and orphaned code is defined by exactly that distinction.

**The seam's own type system.** `client.ts` is a contract between two TypeScript files. The server is Python. Nothing in either language's type checker spans the gap.

The general statement: **a seam tested only from each side in isolation is a seam nobody has tested.**

## Solution

**Routes added.** `POST /wallet/reservations` and `POST /wallet/reservations/{reservation_id}/{action}` mounted in `src/app/wallet/router.py`. The reserve route takes a `depth`, never an amount — the price comes from `app.pricing`, because a client that sent an amount would be a client that set one. `action` is a path literal (`settle` | `release`) rather than a body field, so the two outcomes are distinct URLs and a typo cannot silently move money the wrong way.

**Callers wired.** `apps/web/src/features/engagement/profileSync.ts` now joins the local store to the server profile: `pull()` on sign-in, `pushMemory()` / `forgetMemory()` written through on change, `pushEngagement()` mirroring the fatigue counters, `forgetAll()` awaited because it is the one write where silent failure breaks a promise shown to the user in as many words. The local `localStorage` copy stays as a synchronous read cache — the engagement engine reads the profile while choosing what to offer and cannot await a promise inside that decision.

**Seam methods added.** `updateName`, `changePassword`, `requestEmailChange` and `confirmEmailChange` declared on `AuthApi` and implemented in **both** `realClient.ts` and `mockClient.ts`. `CardField` became controlled (`value` / `onChange`, uncontrolled when no `value` is supplied) and `CardButton` gained `onClick`, so `pages/AccountPage.tsx` can actually submit.

**Tests moved to HTTP.** New integration tests in `caspr-backend/tests/integration/` — `test_reservations.py`, `test_resolve.py`, `test_account.py` — drive an `httpx.AsyncClient` against the mounted app rather than a service object. They sign up, verify, and carry a real bearer. The assertions that carry weight are the ones that fail silently otherwise: the wire *field names* on the wallet snapshot (not the model's attributes), that a change request leaves the account exactly where it was, that the user id never moves, and that a password change ends every other session.

## Why This Works

Each of the three defects lived in the gap between two internally consistent halves. Every fix closes the gap by making at least one test span it:

- An **HTTP-level** backend test cannot pass against an unmounted route. Routing is now part of the thing under test rather than an assumption around it.
- A **seam method with a caller** turns a silent orphan into a live path — the memory writes are now on the sign-in and answer paths, so a break shows up as a broken feature rather than as nothing at all.
- The **route diff** is the only one of the three that generalises. It does not test behaviour; it tests *reachability*, which is the exact property both suites are structurally unable to observe. Set difference in one direction finds 404s waiting to happen; the other direction finds code that has never run in production.

The reason this class of bug is worth a permanent instrument rather than a one-off fix: it does not decay gracefully. `POST /wallet/reservations` had been broken for weeks in the part of the product that takes money, and the only evidence anywhere was an error message that looked like a bad connection.

## Prevention

### 1. The route diff — run it in five minutes on any client/server pair

Enumerate every server route, enumerate every client call, normalise both, set-difference both ways. The script below is the one that produced the clean result on Caspr; it is generic enough to point at any FastAPI + TypeScript pair.

```python
#!/usr/bin/env python3
"""Diff every backend route against every client call, in both directions.

  python route_diff.py <backend-app-dir> <frontend-src-dir> [mount-prefix]

Exits non-zero if the client calls a path the server does not serve.
"""
from __future__ import annotations
import re, sys
from pathlib import Path

BACKEND = Path(sys.argv[1])
FRONTEND = Path(sys.argv[2])
MOUNT = sys.argv[3] if len(sys.argv) > 3 else "/api/v1"

PREFIX = re.compile(r'APIRouter\([^)]*prefix\s*=\s*"([^"]*)"', re.S)
ROUTE = re.compile(r'@\w*router\.(get|post|put|patch|delete)\(\s*\n?\s*"([^"]*)"')
DEF = re.compile(r'(?:function|const)\s+(\w+)\b')
BARE = re.compile(r'fetch\(\s*`\$\{[\w.]*apiBase\}([^`]*)`')


def norm(p: str) -> str:
    p = re.sub(r'\$\{[^}]*\}', '{}', p)   # ${encodeURIComponent(id)} -> {}
    p = re.sub(r'\{[^}]*\}', '{}', p)     # {reservation_id}          -> {}
    return p.split('?')[0].rstrip('/') or '/'


def backend() -> set[str]:
    out = set()
    for f in BACKEND.rglob('*.py'):
        src = f.read_text(encoding='utf-8', errors='replace')
        m = PREFIX.search(src)
        for verb, path in ROUTE.findall(src):
            out.add(norm(MOUNT + (m.group(1) if m else '') + path))
    return out


def wire_helpers(sources: list[str]) -> set[str]:
    """Every local function that reaches the wire, directly or through another.

    Discovered to a fixpoint rather than hardcoded. A hardcoded list is exactly
    how the first version of this probe missed every auth call and reported that
    the client had no auth at all: the probe was wrong, not the code.
    """
    found: set[str] = set()
    while True:
        grew = False
        for src in sources:
            for m in DEF.finditer(src):
                if m.group(1) in found:
                    continue
                body = src[m.end():m.end() + 600]
                if 'apiBase' in body or any(re.search(rf'\b{h}\(', body) for h in found):
                    found.add(m.group(1)); grew = True
        if not grew:
            return found


def frontend() -> tuple[set[str], set[str]]:
    files = [f for f in list(FRONTEND.rglob('*.ts')) + list(FRONTEND.rglob('*.tsx'))
             if '.test.' not in f.name and 'mock' not in f.name.lower()]
    sources = [f.read_text(encoding='utf-8', errors='replace') for f in files]
    call = re.compile(r'\b(%s)\(\s*[`\'"](/[^`\'"]*)[`\'"]' % '|'.join(sorted(wire_helpers(sources))))
    paths, used = set(), set()
    for src in sources:
        for name, p in call.findall(src):
            # A path that *starts* with an interpolation is assembled elsewhere;
            # it carries no route to compare. Interpolated params mid-path are
            # fine — norm() flattens them to the same {} the server uses.
            if p.startswith('${'):
                continue
            paths.add(norm(MOUNT + p)); used.add(name)
        for p in BARE.findall(src):
            if p.startswith('${'):   # the helpers' own fetch(`${apiBase}${path}`)
                continue
            paths.add(norm(MOUNT + p)); used.add('fetch')
    return paths, used


srv, (cli, used) = backend(), frontend()
print(f'{len(srv)} backend routes   {len(cli)} client calls   via: {", ".join(sorted(used))}\n')
print('CALLERS WITH NO ROUTE  — the client posts into a 404')
for p in sorted(cli - srv) or ['(none)']:
    print(f'  {p}')
print('\nROUTES WITH NO CALLER  — server code nothing reaches')
for p in sorted(srv - cli) or ['(none)']:
    print(f'  {p}')
sys.exit(1 if cli - srv else 0)
```

Run it from the frontend repo root:

```bash
python route_diff.py ../caspr-backend/src/app apps/web/src /api/v1
```

Current clean output — the four remaining orphans are correct, and knowing *why* each is expected is the point of reading the list rather than the exit code:

```
33 backend routes   29 client calls   via: authed, fetch, post, postAuth, walletGet, walletPost, walletPut

CALLERS WITH NO ROUTE  — the client posts into a 404
  (none)

ROUTES WITH NO CALLER  — server code nothing reaches
  /api/v1/.well-known/jwks.json     # read by resource servers, not by us
  /api/v1/health/live               # read by the load balancer
  /api/v1/health/ready              # read by the load balancer
  /api/v1/wallet/webhook            # called by Stripe
```

**Four things that make it work, and each was a bug in an earlier draft:**

1. **Prefixes on both sides.** `APIRouter(prefix="/wallet")` plus the `/api/v1` mount from `main.py`. Comparing bare decorator paths against full client URLs produces a diff where nothing matches anything.
2. **Path params normalised to a placeholder.** `{reservation_id}` on the server and `${encodeURIComponent(id)}` on the client both flatten to `{}`. Without this every parameterised route is a false positive.
3. **Helper discovery to a fixpoint, not a hardcoded list.** This is the trap, and it is worth stating plainly: **a first attempt that only matched direct `fetch` calls missed every auth call and made it look as though the client had no auth at all. The probe was wrong, not the code.** Caspr routes wire calls through `postAuth`, `authed`, `walletGet`, `walletPost`, `walletPut` — and through `post`, which is a helper *over* `postAuth` and therefore invisible to any scan that only looks for `apiBase` one level deep. The fixpoint loop catches transitive helpers. **Check a new diff tool against known-good pairs before trusting a word of its output** — if a route you can see being called in the browser shows up as orphaned, fix the probe.
4. **Excluding tests and mocks from the client scan.** A mock that implements every route makes every route look called, which is the same blindness the tool exists to break.

### 2. The seam rule

Recorded in `apps/web/src/data/AGENTS.md`, where anyone adding a client method will read it:

> Adding a method: declare it on the seam in `client.ts` with the *why*, implement it in **both** clients, then find the caller. A method with no caller is the same defect as a route with no method — `POST /wallet/reservations` existed on neither side for weeks and every test passed.

The same file's Verification section carries the route diff, and the standing note that a route with no caller and a caller with no route are both silent — *ours runs against a mock that answers, theirs tests service objects directly.*

### 3. Backend integration tests go through HTTP

New route work is tested against the mounted application with `httpx.AsyncClient`, not against the service object. Service-level tests keep their place for arithmetic and invariants; they are no longer the *only* test a route has. `tests/integration/test_reservations.py` opens by saying so, so the next reader learns the lesson rather than the assertions.

### 4. Assert wire field names, not model attributes

Adjacent failure, same family, and it is worth carrying in the same habit: a snapshot response was cast from `snake_case` JSON to a `camelCase` TypeScript type, every field came back `undefined`, the app header rendered `$NaN` on every screen, and the whole suite passed — because the mock happened to be written in camelCase. The wallet snapshot test now asserts the names on the wire. `data/AGENTS.md` states the rule as **a cast is not a conversion**: every seam method returning a typed object needs a mapping function.
