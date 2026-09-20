import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const root = new URL('..', import.meta.url);
const read = (file) => fs.readFileSync(new URL(file, root), 'utf8');

test('the game shell exposes the play contract', () => {
  const html = read('index.html');
  assert.match(html, /data-testid="game-stage"/);
  assert.match(html, /data-testid="start-button"/);
  assert.match(html, /data-testid="sound-button"/);
  assert.match(html, /data-testid="fullscreen-button"/);
  assert.match(html, /RALPH-98/);
  assert.match(html, /08 MODELLEN ONLINE/);
  assert.match(html, /lang="nl"/);
});

test('the game uses a fixed physics step and a full model ensemble', () => {
  const source = read('src/main.js');
  assert.match(source, /const FIXED_STEP = 1 \/ 60/);
  assert.match(source, /const SQUAD = \[/);
  assert.equal((source.match(/name: '/g) || []).length, 8);
  assert.match(source, /runBatch/);
  assert.match(source, /AudioContext/);
  assert.match(source, /requestFullscreen/);
  assert.match(source, /key === 'f'/);
  assert.doesNotMatch(source, /fetch\(/);
});

test('the release metadata keeps the ensemble and Ralph contract documented', () => {
  const readme = read('README.md');
  const context = read('CONTEXT.md');
  assert.match(readme, /RALPH-98/);
  assert.match(readme, /modelensemble/i);
  assert.match(readme, /1000/);
  assert.match(context, /aetherdev-frontend-3d/);
  assert.match(context, /plan-panel/);
  assert.match(context, /Nederlands/);
});
