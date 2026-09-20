# MODEL ARENA // 3D PONG — CONTEXT

## Doel en scope

Dit is een nieuwe, geïsoleerde game-repository voor een eenvoudige maar grafisch uitgesproken 3D Pong-game waarin een mens tegen een model speelt. De client gebruikt Three.js en Vite. Tijdens het spelen is er geen provider-aanroep, geen sleutel in de browser en geen runtime-afhankelijkheid van LiteLLM.

Taal van de gebruikerservaring en deze projectdocumentatie: **Nederlands**. Modelnamen, code, commando’s en technische API-namen blijven waar nodig onvertaald.

Release-links: [GitHub-repository](https://github.com/Maca2024/3d-pong-model-arena) · [live Vercel-build](https://3d-pong-model-arena.vercel.app)

## Orkestratie

### Atlas / `/aetherdev`

- Route: `aetherdev-frontend-3d`
- Versiehash: `27bf91fc05b515e3`
- Reden: de opdracht vraagt om een interactieve 3D-frontend; het begrensde fragment adviseerde Three.js / React Three Fiber voor echte 3D-interactie in plaats van een scroll-frame-animatie.
- Gebruikte excerptlimiet: 800 tokens.
- Uitkomst vastgelegd in Kathedraal Atlas onder sessie `kathedraal-3d-pong`.

### LiteLLM-modelensemble

De acht-model-`plan-panel` is aangeroepen met een begrensde ontwerpbrief voor MODEL ARENA. De proxy gaf HTTP 200 terug met:

```text
model:             plan-panel
prompt_tokens:     5.769
completion_tokens: 8.615
total_tokens:      14.673
```

De samenwerkende rollen:

1. Astra — baancompositie, belichting en leesbaarheid.
2. Claude — adaptieve moeilijkheid, vaste 60 Hz-fysica en focusveiligheid.
3. DeepSeek — ruimtelijke inslagvoorspelling.
4. Kimi — rallytempo, reactievensters en snelheidsopbouw.
5. GLM — tegenzetlabels en returnfeedback.
6. Gemini — patroonrotatie en responsive compositie.
7. Mistral — snelheid, balspoor en momentum.
8. Grok — browserhooks en interactieverificatie.

De panelraad wees muiscamera, boostmechaniek en achtergrondmuziek af als scope creep. Voor deze release is dat bewust aangepast: **sonische feedback** is toegevoegd als functioneel spelonderdeel, maar zonder externe audiobestanden of netwerkpad.

Volledig bewijs staat in [`docs/model-collaboration.md`](docs/model-collaboration.md).

## Technische uitvoering

### Spel

- Three.js-perspectiefbaan met rastervloer, mist, rails, ballicht, stofveld en bewegingsspoor.
- Vaste physicsstap van `1 / 60` seconde, losgekoppeld van renderen.
- Eerste tot zeven, batje-offset bepaalt de terugkaatshoek.
- RALPH-98 gebruikt voorspelde inslag, reactietijd, rallylengte, strategie-rotatie en een harde snelheidslimiet.
- Toetsenbord, pointer, touch, pauze bij focusverlies en reset.

### Geluid

- Web Audio API wordt pas na gebruikersinteractie gestart om autoplaybeleid te respecteren.
- Korte oscillator-tonen voor opslag, batje, wand, punt en winst.
- Mastergain blijft laag; `GELUID AAN`/`GELUID UIT` is direct bestuurbaar.
- De geautomatiseerde 1000-runs-modus onderdrukt geluid zodat tests snel en stil blijven.

### Beeldvullend

- De baan schaalt met `svh`/`dvh` en krijgt op desktop een royale viewporthoogte.
- `VOLLEDIG SCHERM` gebruikt `courtFrame.requestFullscreen()`.
- `F` schakelt dezelfde fullscreenbaan direct in en uit; een herhaalde toetsdruk wordt genegeerd.
- `fullscreenchange` houdt knoplabel, score-overlay, status en canvas synchroon.
- `Esc` werkt via de browser en sluit de fullscreenbaan.

### 1000-runs-kwaliteitscontrole

`window.__pongGame.runBatch(1000)` speelt de echte game-loop 1000 keer uit met een automatische menselijke speler. Elke run doorloopt opslag, rally, botsingen, score, reset en match-einde. De Playwright-runner [`tests/play_1000.py`](tests/play_1000.py) controleert dat alle 1000 matches eindigen met precies één winnaar en schrijft JSON-bewijs naar `test-results/batch-1000.json`.

Laatste lokale resultaat: **1000/1000**, **12.264 rallyhits**, **1000 modelwinsten**, circa **436 ms**. De publieke Vercel-alias is daarna opnieuw gecontroleerd: **1000/1000**, dezelfde **12.264 rallyhits** en circa **906 ms**. De batchstrategie forceert na een lange rally een begrensde menselijke misser om eindeloze perfecte rallies te voorkomen; dit verandert de normale interactieve spelmodus niet.

## Ralph-98-kwaliteitslus

1. **Ontwerp:** acht modelrollen worden door LiteLLM samengebracht.
2. **Bouw:** Three.js-baan, vaste fysica, lokale opponent, geluid en fullscreen.
3. **Statisch:** Node-contracttests controleren selectors, acht modellen, AudioContext, Fullscreen API en batch-runner.
4. **Interactief:** Playwright controleert desktop, mobiel, besturing, reset, geluid, fullscreen en consolefouten.
5. **Uithouding:** 1000 volledige matches worden automatisch uitgespeeld.
6. **Release:** Vite-build, GitHub-push, Vercel-deploy en publieke smoke-test.

De `98%` is een product- en persoonlijkheidsdoel, geen gemeten winstpercentage.

## Bestandskaart

| Bestand | Functie |
|---|---|
| `index.html` | Nederlandse game-shell, score, controls, geluid en fullscreenknoppen |
| `src/main.js` | Three.js-scène, lokale tegenstander, Web Audio, Fullscreen API en batchrunner |
| `src/style.css` | Neonlaboratorium, beeldvullende layout, responsive gedrag en reduced motion |
| `tests/game.test.js` | Statische contracttests |
| `tests/browser_smoke.py` | Playwright desktop/mobiele rooktest |
| `tests/play_1000.py` | 1000 volledige matches via de echte engine |
| `scripts/request_ensemble.py` | Reproduceerbare LiteLLM-vraag zonder secrets in output |
| `docs/model-collaboration.md` | Acht-modelbesluiten en panelbewijs |
| `vercel.json` | Vite-buildinstellingen voor Vercel |

## Verificatieledger

| Controle | Resultaat |
|---|---|
| `npm test` | PASS; statische contracttests |
| `npm run build` | PASS; Vite productiebuild |
| `git diff --check` | PASS |
| Playwright desktop/mobiel | PASS; controls, reset, geluid, fullscreenknop, screenshots, 0 console-errors |
| 1000 automatische matches | PASS; 1000 beëindigde matches, één winnaar per match |
| Vercel-deployment | PASS; `https://3d-pong-model-arena.vercel.app` |
| GitHub remote | PASS; `main` op `Maca2024/3d-pong-model-arena` |

## Release

- GitHub: [Maca2024/3d-pong-model-arena](https://github.com/Maca2024/3d-pong-model-arena)
- Vercel: [3d-pong-model-arena.vercel.app](https://3d-pong-model-arena.vercel.app)
- Basiscommit: `bd071c5`
- Eerste release-documentatie: `ef468d4`
- Functionele release met geluid, fullscreen en batchrunner: `2529c6a`
- Laatste documentatie- en verificatiebewijs: `a88a8b9`
