# MODEL ARENA // 3D PONG — CONTEXT

## Purpose

This is a new, isolated game repository created from the request to build a simple 3D Pong game in which a human plays against a model. The implementation uses Three.js and Vite. It is intentionally frontend-only during play: no browser key, prompt or provider request is needed after load.

## Orchestration record

### Atlas / `/aetherdev`

- Route: `aetherdev-frontend-3d`
- Version hash: `27bf91fc05b515e3`
- Reason: the task requires an interactive 3D frontend; the bounded excerpt selected Three.js / React Three Fiber for full 3D interaction instead of scroll-frame animation.
- Excerpt cap used: 800 tokens.
- Outcome recorded in the Kathedraal Atlas for session `kathedraal-3d-pong`.

### LiteLLM model ensemble

The eight-model `plan-panel` was called with a bounded design brief for MODEL ARENA. The proxy returned HTTP 200 with `plan-panel`, `prompt_tokens: 5769`, `completion_tokens: 8615`, `total_tokens: 14673`.

The collaborating roster was:

1. Astra — arena composition, lighting and court readability.
2. Claude — adaptive difficulty, fixed-step physics and pause safety.
3. DeepSeek — lane split and bounce prediction.
4. Kimi — rally tempo, reaction windows and speed ramp.
5. GLM — counter-play labels and return feedback.
6. Gemini — pattern rotation and responsive composition.
7. Mistral — velocity handling, trail and momentum.
8. Grok — browser-test hooks and interaction verification.

The panel rejected scope creep (mouse-camera, boost and background music) and converged on: a local opponent, first-to-seven scoring, a 60 Hz physics step, keyboard/pointer/touch control, a hard speed cap, `data-testid` hooks and Playwright smoke coverage.

Full evidence is in [`docs/model-collaboration.md`](docs/model-collaboration.md).

## Build direction

The visual direction is **instrument-panel neon laboratory**: deep blue-green ink, mint model energy, coral human energy, mono telemetry and a quiet editorial layout around the court. The model opponent is named `RALPH-98`; the number is a product personality target, not a measured win-rate claim.

The UI exposes the ensemble as a visible status layer. During a rally, the local controller rotates the active strategy label through the eight roles. That keeps the collaboration legible without creating provider latency or putting credentials in the browser.

## Ralph-98 quality loop

The requested “98% Ralph” is implemented as a release discipline:

1. **Scope:** build only the smallest playable 3D Pong loop.
2. **Mechanics:** fixed-step movement, bounded prediction, paddle-angle rebounds, first-to-seven, pause/reset.
3. **Interface:** responsive desktop/mobile layout, keyboard/pointer/touch affordances, visible status and accessible buttons.
4. **Verification:** production build, static contract tests, Playwright smoke, screenshots, console-error audit.
5. **Release:** Vercel preview/production deployment, public URL, repository evidence.

The “98%” threshold means the loop continues until the critical gameplay and release checks are green; it does not claim 98% model accuracy.

## Files

| File | Responsibility |
|---|---|
| `index.html` | Game shell, score HUD, controls and ensemble display |
| `src/main.js` | Three.js scene, fixed physics, Ralph-98 controller |
| `src/style.css` | Neon laboratory design system and responsive layout |
| `tests/game.test.js` | Node static contract tests |
| `tests/browser_smoke.py` | Playwright desktop/mobile functional smoke |
| `scripts/request_ensemble.py` | Reproducible bounded LiteLLM panel request |
| `docs/model-collaboration.md` | Eight-model design evidence |

## Verification ledger

| Gate | Result |
|---|---|
| Atlas route + bounded excerpt | recorded |
| LiteLLM eight-model panel | HTTP 200; 8-model brief returned |
| `npm run build` | PASS; Vite production build generated |
| `npm test` | PASS; 3/3 static checks |
| Playwright desktop/mobile smoke | PASS; controls, reset, screenshots, 0 console errors |
| Vercel deployment | PASS; `https://3d-pong-model-arena.vercel.app` |

## Release evidence

The local Ralph-98 browser loop passed on desktop and mobile after the court-wall visual fix. The public deployment was then created with Vercel and aliased to `https://3d-pong-model-arena.vercel.app`. The same smoke suite is parameterized with `PONG_URL` so the public URL can be tested without changing source code.

## Change policy

No credentials belong in this repository. The ensemble request reads `LITELLM_MASTER_KEY` from the running proxy container and only writes bounded design evidence. Browser play contains no fetch/XHR call to the model proxy.
