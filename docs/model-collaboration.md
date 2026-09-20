# Eight-model collaboration // MODEL ARENA

## Orchestrator

The Kathedraal LiteLLM `plan-panel` was used as a bounded design council. The prompt asked for a compact implementation brief for a Vite + Three.js 3D Pong game, a local adaptive opponent named `RALPH-98`, no runtime provider dependency, and a browser verification checklist.

The response was HTTP 200 from `plan-panel` with measured usage:

```text
prompt_tokens:     5,769
completion_tokens: 8,615
total_tokens:      14,673
```

## The eight signals

| Model | Role | Decision carried into code |
|---|---|---|
| Astra | visual composition | perspective arena, emissive rails, mint/coral contrast |
| Claude | game systems | fixed 60 Hz physics, pause on window blur, bounded difficulty |
| DeepSeek | spatial reasoning | predicted impact lane for Ralph’s paddle |
| Kimi | tempo | reaction delay, rally speed ramp and first-to-seven rhythm |
| GLM | counter-play | strategy labels and player-return callouts |
| Gemini | pattern layer | rotating active ensemble signal and responsive layout |
| Mistral | motion | velocity handling, trail and momentum feedback |
| Grok | verification | stable `data-testid` hooks and browser smoke targets |

## Deliberate exclusions

The council explicitly rejected mouse-camera controls, a boost mechanic and background music for this first small build. Those features would add surface area without improving the core Pong loop.

## Merged implementation brief

> Single-page Vite + Three.js duel in a dark neon lab. The human plays a local, adaptive RALPH-98 opponent. The court is a 2D physics plane rendered in 3D. Use a 60 Hz physics step, pointer/WASD controls, paddle-offset rebounds, a hard speed cap, first-to-seven scoring, visible confidence/strategy HUD and Playwright hooks. Keep provider calls out of the live game.

## Outcome

The brief was converted into the current game: a responsive instrument-panel UI, an emissive Three.js court, local adaptive opponent logic, model squad display, fixed-step physics, reset/pause controls and desktop/mobile browser coverage. The runtime has no secret-bearing network path.
