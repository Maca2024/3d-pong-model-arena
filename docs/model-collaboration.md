# Acht-modelsamenwerking // MODEL ARENA

## Orkestrator

De Kathedraal-LiteLLM-`plan-panel` is gebruikt als begrensde ontwerpraad. De vraag vroeg om een compacte Vite + Three.js 3D Pong-game, een lokale adaptieve tegenstander met de naam `RALPH-98`, geen providerafhankelijkheid tijdens het spelen en een controleerbare browserrelease.

De proxy gaf HTTP 200 terug met het volgende gemeten gebruik:

```text
prompt_tokens:     5.769
completion_tokens: 8.615
total_tokens:      14.673
```

## De acht signalen

| Model | Rol | Besluit dat in de code terechtkwam |
|---|---|---|
| Astra | visuele compositie | perspectivische baan, emissieve rails en mint/koraalcontrast |
| Claude | spelsystemen | vaste 60 Hz-fysica, pauze bij focusverlies en begrensde moeilijkheid |
| DeepSeek | ruimtelijk denken | voorspelde inslagbaan voor Ralphs batje |
| Kimi | tempo | reactievertraging, rally-opbouw en eerste-tot-zeven-ritme |
| GLM | tegenzet | strategielabels en feedback op spelersreturns |
| Gemini | patroonlaag | roterend actief ensemblesignaal en responsive layout |
| Mistral | beweging | snelheid, balspoor en momentumfeedback |
| Grok | verificatie | stabiele `data-testid`-hooks en browserdoelen |

## Besluiten en grenzen

De raad wees een muiscamera, boostmechaniek en achtergrondmuziek af voor de eerste kleine build. Na de gebruikerstest is **sonische feedback** alsnog toegevoegd: korte Web Audio-tonen voor opslag, batje, wand, punt en winst. Er zijn geen externe audiobestanden toegevoegd, zodat de game lokaal en zonder extra netwerkpad blijft werken.

Ook toegevoegd na de eerste release:

- fullscreenbaan via de Fullscreen API;
- een viewportvullende responsive layout;
- een echte 1000-runs-batch over dezelfde vaste game-loop;
- volledig Nederlandse gebruikersinterface en release-documentatie.

## Samengevoegde ontwerpbrief

> Een single-page Vite + Three.js-duel in een donker neonlaboratorium. De mens speelt tegen een lokale, adaptieve RALPH-98. De baan is een 2D-fysicaplane die in 3D wordt weergegeven. Gebruik een vaste stap van 60 Hz, pointer/WASD-besturing, terugkaatsingen op basis van batje-offset, een harde snelheidslimiet, eerste tot zeven, zichtbare zekerheid/strategie, Web Audio-feedback, fullscreen en Playwright-hooks. Houd provider-aanroepen uit de live game.

## Uitkomst

De ontwerpbrief is omgezet naar een responsive instrumentenpaneel, een emissieve Three.js-baan, lokale Ralph-logica, zichtbare modelploeg, vaste fysica, reset/pauze, geluid, fullscreen en desktop/mobiele browserdekking. De runtime heeft geen pad waarin geheimen naar een provider kunnen lekken.

De Atlas-route is vastgelegd als `aetherdev-frontend-3d`, versiehash `27bf91fc05b515e3`, met sessie `kathedraal-3d-pong`.
