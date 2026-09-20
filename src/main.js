import * as THREE from 'three';
import './style.css';

const stage = document.querySelector('#game-stage');
const startButton = document.querySelector('#start-button');
const resetButton = document.querySelector('#reset-button');
const playerScoreEl = document.querySelector('#player-score');
const aiScoreEl = document.querySelector('#ai-score');
const courtStatusEl = document.querySelector('#court-status');
const confidenceEl = document.querySelector('#confidence');
const confidenceMeterEl = document.querySelector('#confidence-meter');
const reactionEl = document.querySelector('#reaction');
const strategyEl = document.querySelector('#strategy');
const modelCalloutEl = document.querySelector('#model-callout');
const rallyEl = document.querySelector('#rally-count');
const lastCallEl = document.querySelector('#last-call');
const squadGridEl = document.querySelector('#squad-grid');

const SQUAD = [
  { name: 'ASTRA', role: 'vision', color: '#7ff1d1' },
  { name: 'DEEPSEEK', role: 'angle', color: '#86b6ff' },
  { name: 'KIMI', role: 'tempo', color: '#d99bff' },
  { name: 'CLAUDE', role: 'safety', color: '#ffb37a' },
  { name: 'GLM', role: 'counter', color: '#ffe29a' },
  { name: 'GEMINI', role: 'pattern', color: '#9de7ff' },
  { name: 'MISTRAL', role: 'velocity', color: '#ff8c79' },
  { name: 'GROK', role: 'risk', color: '#c1ff9a' },
];

SQUAD.forEach((member, index) => {
  const chip = document.createElement('span');
  chip.className = 'squad-chip';
  chip.dataset.model = member.name;
  chip.textContent = member.name;
  chip.title = `${member.name} // ${member.role}`;
  chip.style.setProperty('--chip-color', member.color);
  if (index === 0) chip.classList.add('active');
  squadGridEl.appendChild(chip);
});
const squadChips = [...squadGridEl.querySelectorAll('.squad-chip')];

const scene = new THREE.Scene();
scene.background = new THREE.Color('#07151b');
scene.fog = new THREE.Fog('#07151b', 17, 31);

const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
camera.position.set(0, 6.1, 13.8);
camera.lookAt(0, -0.45, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;
stage.appendChild(renderer.domElement);

const mint = new THREE.Color('#7ff1d1');
const coral = new THREE.Color('#ff8c79');
const yellow = new THREE.Color('#ffe29a');

scene.add(new THREE.HemisphereLight('#b4fff0', '#071018', 1.4));
const keyLight = new THREE.PointLight('#7ff1d1', 18, 22, 2);
keyLight.position.set(0, 5, 2);
scene.add(keyLight);
const warmLight = new THREE.PointLight('#ff745e', 12, 18, 2);
warmLight.position.set(0, 2, -7);
scene.add(warmLight);

const arena = new THREE.Group();
scene.add(arena);

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(19, 13),
  new THREE.MeshStandardMaterial({ color: '#0a262b', roughness: 0.62, metalness: 0.25, transparent: true, opacity: 0.92 }),
);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -4.72;
arena.add(floor);

const grid = new THREE.GridHelper(19, 19, '#1e756e', '#123d40');
grid.position.set(0, -4.69, 0);
grid.material.transparent = true;
grid.material.opacity = 0.48;
arena.add(grid);

function addRail(position, size, color = '#3ca89a') {
  const rail = new THREE.Mesh(
    new THREE.BoxGeometry(...size),
    new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 1.5, roughness: 0.35, metalness: 0.4 }),
  );
  rail.position.set(...position);
  arena.add(rail);
  return rail;
}

function addBackdrop(position, size, color) {
  const wall = new THREE.Mesh(
    new THREE.BoxGeometry(...size),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.07, depthWrite: false }),
  );
  wall.position.set(...position);
  arena.add(wall);
}

addRail([0, 4.62, 0], [18.4, 0.1, 0.12]);
addRail([0, -4.62, 0], [18.4, 0.1, 0.12]);
addRail([-9.12, 0, 0], [0.1, 9.3, 0.12]);
addRail([9.12, 0, 0], [0.1, 9.3, 0.12]);
addBackdrop([0, 0, 5.92], [18.4, 9.3, 0.08], '#2b726b');
addBackdrop([0, 0, -5.92], [18.4, 9.3, 0.08], '#7d473d');

const centerLine = new THREE.Mesh(
  new THREE.BoxGeometry(0.045, 8.95, 0.045),
  new THREE.MeshBasicMaterial({ color: '#7ff1d1', transparent: true, opacity: 0.46 }),
);
centerLine.position.set(0, -0.05, 0);
arena.add(centerLine);

function makePaddle(color) {
  const group = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(2.45, 1.38, 0.38),
    new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 1.2, roughness: 0.25, metalness: 0.54 }),
  );
  group.add(body);
  const rim = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(2.53, 1.46, 0.42)),
    new THREE.LineBasicMaterial({ color: '#e7fff9', transparent: true, opacity: 0.62 }),
  );
  group.add(rim);
  return group;
}

const playerPaddle = makePaddle(coral);
playerPaddle.position.set(0, 0, 4.7);
arena.add(playerPaddle);
const aiPaddle = makePaddle(mint);
aiPaddle.position.set(0, 0, -4.7);
arena.add(aiPaddle);

const ball = new THREE.Mesh(
  new THREE.SphereGeometry(0.34, 24, 16),
  new THREE.MeshStandardMaterial({ color: '#f9fff6', emissive: '#baffdf', emissiveIntensity: 3.4, roughness: 0.08, metalness: 0.1 }),
);
ball.position.set(0, 0, 0);
arena.add(ball);
const ballLight = new THREE.PointLight('#baffdf', 13, 5, 2);
ball.add(ballLight);

const trailPoints = Array.from({ length: 11 }, () => new THREE.Vector3());
const trailGeometry = new THREE.BufferGeometry().setFromPoints(trailPoints);
const trail = new THREE.Line(
  trailGeometry,
  new THREE.LineBasicMaterial({ color: '#baffdf', transparent: true, opacity: 0.22 }),
);
arena.add(trail);

const dustPositions = new Float32Array(150 * 3);
for (let index = 0; index < 150; index += 1) {
  dustPositions[index * 3] = (Math.random() - 0.5) * 20;
  dustPositions[index * 3 + 1] = (Math.random() - 0.5) * 10;
  dustPositions[index * 3 + 2] = (Math.random() - 0.5) * 13;
}
const dustGeometry = new THREE.BufferGeometry();
dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
const dust = new THREE.Points(dustGeometry, new THREE.PointsMaterial({ color: '#79cfc3', size: 0.025, transparent: true, opacity: 0.48 }));
arena.add(dust);

const bounds = { x: 8.55, y: 4.12, z: 4.62 };
const keys = new Set();
const pointerTarget = new THREE.Vector2();
const velocity = new THREE.Vector3();
const state = {
  running: false,
  playerScore: 0,
  aiScore: 0,
  rally: 0,
  elapsed: 0,
  serveTimer: 0,
  lastCall: 'STANDBY',
  strategy: 'ANGLE READ',
  confidence: 0.98,
  reaction: 0.24,
  lastHit: 0,
};

function updateSquad(activeIndex) {
  squadChips.forEach((chip, index) => chip.classList.toggle('active', index === activeIndex));
}

function setCallout(message, call = state.lastCall) {
  state.lastCall = call;
  modelCalloutEl.textContent = message;
  lastCallEl.textContent = call;
}

function updateHud() {
  playerScoreEl.textContent = String(state.playerScore).padStart(2, '0');
  aiScoreEl.textContent = String(state.aiScore).padStart(2, '0');
  rallyEl.textContent = String(state.rally).padStart(2, '0');
  confidenceEl.textContent = `${(state.confidence * 100).toFixed(1)}%`;
  confidenceMeterEl.style.width = `${Math.round(state.confidence * 100)}%`;
  reactionEl.textContent = `${state.reaction.toFixed(2)}s`;
  strategyEl.textContent = state.strategy;
}

function reflected(value, limit) {
  let result = value;
  while (result > limit || result < -limit) {
    if (result > limit) result = limit - (result - limit);
    if (result < -limit) result = -limit - (result + limit);
  }
  return result;
}

function serve(direction = Math.random() > 0.5 ? 1 : -1) {
  ball.position.set(0, 0, 0);
  const angle = (Math.random() - 0.5) * 0.72;
  velocity.set(angle * 4.2, (Math.random() - 0.5) * 2.4, direction * 6.5);
  velocity.normalize().multiplyScalar(7.1);
  state.serveTimer = 0.45;
  trailPoints.forEach((point) => point.copy(ball.position));
}

function resetMatch() {
  state.running = false;
  state.playerScore = 0;
  state.aiScore = 0;
  state.rally = 0;
  state.elapsed = 0;
  state.confidence = 0.98;
  state.reaction = 0.24;
  state.strategy = 'ANGLE READ';
  playerPaddle.position.set(0, 0, 4.7);
  aiPaddle.position.set(0, 0, -4.7);
  serve(1);
  setCallout('Waiting for the first serve.', 'STANDBY');
  courtStatusEl.textContent = 'READY / PRESS START';
  startButton.querySelector('span:last-child').textContent = 'START MATCH';
  updateSquad(0);
  updateHud();
}

function startMatch() {
  state.running = !state.running;
  courtStatusEl.textContent = state.running ? 'LIVE / ENSEMBLE ONLINE' : 'PAUSED / PRESS START';
  startButton.querySelector('span:last-child').textContent = state.running ? 'PAUSE MATCH' : 'RESUME MATCH';
  if (state.running) setCallout('Eight signals synced. Return the first serve.', 'SYNCED');
}

function score(playerWon) {
  if (playerWon) state.playerScore += 1;
  else state.aiScore += 1;
  state.rally = 0;
  const winner = state.playerScore >= 7 || state.aiScore >= 7;
  if (winner) {
    state.running = false;
    const humanWon = state.playerScore >= 7;
    courtStatusEl.textContent = humanWon ? 'MATCH COMPLETE / YOU WIN' : 'MATCH COMPLETE / RALPH WINS';
    setCallout(humanWon ? 'The ensemble did not predict that return.' : 'Ralph-98 closed the angle. Run it back.', humanWon ? 'HUMAN WIN' : 'MODEL WIN');
    startButton.querySelector('span:last-child').textContent = 'PLAY AGAIN';
    updateHud();
    return;
  }
  const direction = playerWon ? -1 : 1;
  serve(direction);
  setCallout(playerWon ? 'Clean return. Ralph is recalibrating.' : 'Ralph found the seam. Keep moving.', playerWon ? 'PLAYER POINT' : 'MODEL POINT');
  updateHud();
}

function playerInput(dt) {
  const keyboard = new THREE.Vector2();
  if (keys.has('w') || keys.has('arrowup')) keyboard.y += 1;
  if (keys.has('s') || keys.has('arrowdown')) keyboard.y -= 1;
  if (keys.has('a') || keys.has('arrowleft')) keyboard.x -= 1;
  if (keys.has('d') || keys.has('arrowright')) keyboard.x += 1;
  const hasKeyboard = keyboard.lengthSq() > 0;
  if (hasKeyboard) {
    keyboard.normalize().multiplyScalar(8.5 * dt);
    pointerTarget.x = THREE.MathUtils.clamp(pointerTarget.x + keyboard.x, -bounds.x + 1.2, bounds.x - 1.2);
    pointerTarget.y = THREE.MathUtils.clamp(pointerTarget.y + keyboard.y, -bounds.y + 0.75, bounds.y - 0.75);
  }
  playerPaddle.position.x = THREE.MathUtils.damp(playerPaddle.position.x, pointerTarget.x, 13, dt);
  playerPaddle.position.y = THREE.MathUtils.damp(playerPaddle.position.y, pointerTarget.y, 13, dt);
}

function modelInput(dt) {
  const modelIndex = Math.floor(state.elapsed * 1.5 + state.rally) % SQUAD.length;
  const active = SQUAD[modelIndex];
  updateSquad(modelIndex);
  let targetX = 0;
  let targetY = 0;
  if (velocity.z < 0) {
    const interceptTime = Math.max(0, (aiPaddle.position.z - ball.position.z) / velocity.z);
    targetX = reflected(ball.position.x + velocity.x * interceptTime, bounds.x - 1.3);
    targetY = reflected(ball.position.y + velocity.y * interceptTime, bounds.y - 0.85);
    state.strategy = active.role === 'risk' ? 'RISK VECTOR' : `${active.role.toUpperCase()} READ`;
  } else {
    targetX = Math.sin(state.elapsed * 0.8) * 1.4;
    targetY = Math.cos(state.elapsed * 0.55) * 0.7;
    state.strategy = 'CENTER HOLD';
  }
  state.reaction = THREE.MathUtils.lerp(0.34, 0.12, Math.min(1, state.rally / 14));
  aiPaddle.position.x = THREE.MathUtils.damp(aiPaddle.position.x, targetX, 1 / state.reaction, dt);
  aiPaddle.position.y = THREE.MathUtils.damp(aiPaddle.position.y, targetY, 1 / state.reaction, dt);
  state.confidence = THREE.MathUtils.clamp(0.98 + Math.min(state.rally, 8) * 0.002 - (velocity.z > 0 ? 0.01 : 0), 0.94, 0.995);
}

function checkPaddle(paddle, isPlayer) {
  const movingTowardPaddle = isPlayer ? velocity.z > 0 : velocity.z < 0;
  const crossing = isPlayer ? ball.position.z >= bounds.z : ball.position.z <= -bounds.z;
  const withinPaddle = Math.abs(ball.position.x - paddle.position.x) < 1.42 && Math.abs(ball.position.y - paddle.position.y) < 0.95;
  if (!movingTowardPaddle || !crossing || !withinPaddle) return false;
  ball.position.z = isPlayer ? bounds.z - 0.04 : -bounds.z + 0.04;
  velocity.z = Math.abs(velocity.z) * (isPlayer ? -1 : 1);
  const offsetX = (ball.position.x - paddle.position.x) * 0.72;
  const offsetY = (ball.position.y - paddle.position.y) * 0.72;
  velocity.x += offsetX;
  velocity.y += offsetY;
  velocity.multiplyScalar(1.035);
  state.rally += 1;
  state.lastHit = performance.now();
  if (isPlayer) setCallout('Return registered. The ensemble is reading your spin.', 'RETURN LOCK');
  return true;
}

function updateGame(dt) {
  playerInput(dt);
  modelInput(dt);
  if (!state.running) return;
  state.elapsed += dt;
  if (state.serveTimer > 0) {
    state.serveTimer -= dt;
    return;
  }
  ball.position.addScaledVector(velocity, dt);
  if (ball.position.x > bounds.x || ball.position.x < -bounds.x) {
    ball.position.x = THREE.MathUtils.clamp(ball.position.x, -bounds.x, bounds.x);
    velocity.x *= -1;
  }
  if (ball.position.y > bounds.y || ball.position.y < -bounds.y) {
    ball.position.y = THREE.MathUtils.clamp(ball.position.y, -bounds.y, bounds.y);
    velocity.y *= -1;
  }
  if (checkPaddle(playerPaddle, true) || checkPaddle(aiPaddle, false)) updateHud();
  if (ball.position.z > 6.1) score(false);
  if (ball.position.z < -6.1) score(true);
  trailPoints.unshift(ball.position.clone());
  trailPoints.pop();
  trail.geometry.setFromPoints(trailPoints);
  ball.rotation.x += dt * 4;
  ball.rotation.y += dt * 6;
  updateHud();
}

function resize() {
  const width = Math.max(1, stage.clientWidth);
  const height = Math.max(1, stage.clientHeight);
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

stage.addEventListener('pointermove', (event) => {
  const rect = stage.getBoundingClientRect();
  pointerTarget.x = THREE.MathUtils.clamp(((event.clientX - rect.left) / rect.width) * 2 - 1, -1, 1) * (bounds.x - 1.2);
  pointerTarget.y = THREE.MathUtils.clamp((1 - (event.clientY - rect.top) / rect.height) * 2 - 1, -1, 1) * (bounds.y - 0.75);
});
stage.addEventListener('pointerdown', () => { if (!state.running) startMatch(); });
window.addEventListener('keydown', (event) => {
  const key = event.key.toLowerCase();
  if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(key)) event.preventDefault();
  if (key === ' ') startMatch();
  keys.add(key);
});
window.addEventListener('keyup', (event) => keys.delete(event.key.toLowerCase()));
window.addEventListener('blur', () => {
  if (!state.running) return;
  state.running = false;
  courtStatusEl.textContent = 'PAUSED / WINDOW FOCUS LOST';
  startButton.querySelector('span:last-child').textContent = 'RESUME MATCH';
});
startButton.addEventListener('click', () => startMatch());
resetButton.addEventListener('click', () => resetMatch());
window.addEventListener('resize', resize);
if ('ResizeObserver' in window) new ResizeObserver(resize).observe(stage);

resetMatch();
resize();

const FIXED_STEP = 1 / 60;
let previous = performance.now();
let accumulator = 0;
function render(now) {
  const dt = Math.min(0.035, Math.max(0, (now - previous) / 1000));
  previous = now;
  accumulator = Math.min(accumulator + dt, FIXED_STEP * 4);
  while (accumulator >= FIXED_STEP) {
    updateGame(FIXED_STEP);
    accumulator -= FIXED_STEP;
  }
  dust.rotation.y += dt * 0.012;
  arena.rotation.y = Math.sin(now * 0.00018) * 0.018;
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}
requestAnimationFrame(render);

window.__pongGame = {
  start: startMatch,
  reset: resetMatch,
  getState: () => ({ ...state }),
};
