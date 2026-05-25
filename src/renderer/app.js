/* global counterAPI, copyModule */

const {
  TITLE,
  SUBTITLE,
  TAP_LABEL,
  RESET_LABEL,
  getTier,
  getCountStyle,
  getCardHeatColor,
  getMood,
  getClickBubble,
  getRandomResetConfirm,
  getRandomResetConfirmSub,
  getRandomResetSuccess,
  getRandomRebirth,
  getRandomFishPolice,
  getRandomSpamClick,
  getRandom404,
  getRandomDoubleMerit,
  getRandomTruthMarquee,
  getShakeProfile,
} = copyModule;

const cardEl = document.getElementById('card');
const countEl = document.getElementById('count');
const countRingEl = document.getElementById('countRing');
const clickBubbleEl = document.getElementById('clickBubble');
const truthMarqueeEl = document.getElementById('truthMarquee');
const truthMarqueeTextEl = document.getElementById('truthMarqueeText');
const statusTierEl = document.getElementById('statusTier');
const statusVibeEl = document.getElementById('statusVibe');
const titleEl = document.getElementById('title');
const subtitleEl = document.getElementById('subtitle');
const tapHintEl = document.getElementById('tapHint');
const tapRegion = document.getElementById('tapRegion');
const resetBtn = document.getElementById('resetBtn');
const mascotEl = document.getElementById('mascot');
const rippleEl = document.getElementById('ripple');
const toastEl = document.getElementById('toast');
const resetModal = document.getElementById('resetModal');
const resetConfirmText = document.getElementById('resetConfirmText');
const resetConfirmSub = document.getElementById('resetConfirmSub');
const resetCancel = document.getElementById('resetCancel');
const resetConfirm = document.getElementById('resetConfirm');
const bossOverlay = document.getElementById('bossOverlay');

let incrementInFlight = false;
let currentCount = 0;
let toastTimer = null;
let bubbleTimer = null;
let eggOverride = null;
let eggOverrideTimer = null;
let spamMode = false;
let clickTimestamps = [];
let fishPoliceShown = false;
let lastTruthMarquee = '';
let truthMarqueeRunning = false;

const FISH_IDLE_MS = 2 * 60 * 60 * 1000;
const TRUTH_MARQUEE_MIN_DURATION = 9;
const TRUTH_MARQUEE_PX_PER_SEC = 28;
const SPAM_WINDOW_MS = 3000;
const SPAM_THRESHOLD = 10;

titleEl.textContent = TITLE;
subtitleEl.textContent = SUBTITLE;
tapHintEl.textContent = `${TAP_LABEL} · Ctrl 隐形`;
resetBtn.textContent = RESET_LABEL;

let stealthDisplay = false;
let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) audioCtx = new AudioCtx();
  }
  return audioCtx;
}

function playStealthLaugh() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(520, t);
    osc.frequency.exponentialRampToValueAtTime(310, t + 0.07);
    osc.frequency.exponentialRampToValueAtTime(240, t + 0.13);
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.045, t + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.17);
  } catch {
    /* 静默 */
  }
}

function applyMood(count) {
  mascotEl.className = `mascot mood-${getMood(count)}`;
}

function applyHeat(count) {
  cardEl.style.setProperty('--heat-bg', getCardHeatColor(count));
}

function setVibeText(text, isEgg = false) {
  statusVibeEl.textContent = text;
  statusVibeEl.classList.toggle('egg', isEgg);
}

function render(count, options = {}) {
  currentCount = count;
  stealthDisplay = false;
  countEl.classList.remove('stealth');
  countEl.textContent = String(count);

  const tier = getTier(count);
  statusTierEl.textContent = tier.rank;

  if (!options.keepEggOverride && !spamMode) {
    setVibeText(tier.vibe, false);
    eggOverride = null;
  }

  const style = getCountStyle(count);
  countEl.style.color = style.color;
  countEl.classList.toggle('spam', spamMode);
  countRingEl.classList.toggle('spam-mode', spamMode);
  applyHeat(count);
  applyMood(count);
}

function renderStealth(count) {
  currentCount = count;
  stealthDisplay = true;
  countEl.textContent = String(count);
  countEl.classList.add('stealth');

  const tier = getTier(count);
  statusTierEl.textContent = tier.rank;
  if (!spamMode) {
    setVibeText(tier.vibe, false);
  }

  applyHeat(count);
  applyMood(count);
}

function playRageShake(count) {
  const profile = getShakeProfile(count);
  const amp = Math.min(profile.amplitude, 6);
  const duration = Math.max(0.16, 0.38 - count * 0.0022);

  cardEl.style.setProperty('--rage-amp', `${amp}px`);
  cardEl.style.setProperty('--rage-duration', `${duration}s`);
  cardEl.classList.remove('rage-shake');
  void cardEl.offsetWidth;
  cardEl.classList.add('rage-shake');
  cardEl.addEventListener(
    'animationend',
    () => cardEl.classList.remove('rage-shake'),
    { once: true }
  );

  counterAPI.shakeWindow(profile);
}

function showToast(message, durationMs = 4500) {
  if (toastTimer) clearTimeout(toastTimer);
  toastEl.textContent = message;
  toastEl.classList.remove('hidden');
  toastTimer = setTimeout(() => {
    toastEl.classList.add('hidden');
  }, durationMs);
}

function playTruthMarquee() {
  if (!truthMarqueeTextEl || truthMarqueeRunning) return;

  const text = getRandomTruthMarquee(lastTruthMarquee);
  lastTruthMarquee = text;
  truthMarqueeTextEl.textContent = text;
  truthMarqueeTextEl.classList.remove('run');
  void truthMarqueeTextEl.offsetWidth;

  const textWidth = truthMarqueeTextEl.scrollWidth;
  const viewWidth = truthMarqueeEl?.clientWidth || 64;
  const travel = textWidth + viewWidth;
  const duration = Math.max(
    TRUTH_MARQUEE_MIN_DURATION,
    travel / TRUTH_MARQUEE_PX_PER_SEC
  );

  truthMarqueeTextEl.style.setProperty('--marquee-from', `${viewWidth}px`);
  truthMarqueeTextEl.style.animationDuration = `${duration}s`;
  truthMarqueeRunning = true;
  truthMarqueeTextEl.classList.add('run');

  truthMarqueeTextEl.addEventListener(
    'animationend',
    () => {
      truthMarqueeRunning = false;
      truthMarqueeTextEl.classList.remove('run');
      playTruthMarquee();
    },
    { once: true }
  );
}

function startTruthMarquee() {
  if (!truthMarqueeTextEl) return;
  playTruthMarquee();
}

function showClickBubble(text) {
  if (!text || !clickBubbleEl) return;
  if (bubbleTimer) clearTimeout(bubbleTimer);

  clickBubbleEl.textContent = text;
  clickBubbleEl.classList.remove('show');
  void clickBubbleEl.offsetWidth;
  clickBubbleEl.classList.add('show');

  bubbleTimer = setTimeout(() => {
    clickBubbleEl.classList.remove('show');
  }, 560);
}

function showEggMessage(message, durationMs = 5000) {
  if (eggOverrideTimer) clearTimeout(eggOverrideTimer);
  eggOverride = message;
  setVibeText(message, true);
  eggOverrideTimer = setTimeout(() => {
    eggOverride = null;
    render(currentCount);
  }, durationMs);
}

function playSlapFeedback(event) {
  countRingEl.classList.remove('slap');
  void countRingEl.offsetWidth;
  countRingEl.classList.add('slap');
  countRingEl.addEventListener(
    'animationend',
    () => countRingEl.classList.remove('slap'),
    { once: true }
  );

  mascotEl.classList.remove('wiggle');
  void mascotEl.offsetWidth;
  mascotEl.classList.add('wiggle');
  mascotEl.addEventListener(
    'animationend',
    () => mascotEl.classList.remove('wiggle'),
    { once: true }
  );

  if (event && rippleEl) {
    const rect = tapRegion.getBoundingClientRect();
    rippleEl.style.left = `${event.clientX - rect.left}px`;
    rippleEl.style.top = `${event.clientY - rect.top}px`;
    rippleEl.classList.remove('show');
    void rippleEl.offsetWidth;
    rippleEl.classList.add('show');
    rippleEl.addEventListener(
      'animationend',
      () => rippleEl.classList.remove('show'),
      { once: true }
    );
  }
}

function trackSpamClick() {
  const now = Date.now();
  clickTimestamps = clickTimestamps.filter((t) => now - t < SPAM_WINDOW_MS);
  clickTimestamps.push(now);

  if (clickTimestamps.length >= SPAM_THRESHOLD) {
    spamMode = true;
    cardEl.classList.add('spam-shake');
    const msg = getRandomSpamClick();
    setVibeText(msg, true);
    showClickBubble(msg);
    countEl.classList.add('spam');

    cardEl.addEventListener(
      'animationend',
      () => cardEl.classList.remove('spam-shake'),
      { once: true }
    );

    setTimeout(() => {
      spamMode = false;
      countEl.classList.remove('spam');
      clickTimestamps = [];
      render(currentCount);
    }, 4000);
  }
}

function trigger404Effect() {
  const msg = getRandom404();
  cardEl.classList.add('flash-404');
  showEggMessage(msg, 6000);
  showClickBubble(msg);
  cardEl.addEventListener(
    'animationend',
    () => cardEl.classList.remove('flash-404'),
    { once: true }
  );
}

function handleDailyRebirth(state) {
  const prev =
    typeof state.previousCount === 'number' ? state.previousCount : 0;
  showToast(getRandomRebirth(prev));
}

async function handleIncrement(event) {
  if (incrementInFlight || spamMode) return;
  const isStealth = !!(event && event.ctrlKey);
  incrementInFlight = true;
  fishPoliceShown = false;

  try {
    await counterAPI.checkDate();
    const state = await counterAPI.increment();

    if (isStealth) {
      playStealthLaugh();
      renderStealth(state.count);
    } else {
      render(state.count);
      showClickBubble(getClickBubble());
      if (Math.random() < 0.25 && !truthMarqueeRunning) {
        playTruthMarquee();
      }
      playRageShake(state.count);
      playSlapFeedback(event);
    }

    if (state.didReset) {
      handleDailyRebirth(state);
    }
    if (state.doubleMerit) {
      showToast(getRandomDoubleMerit());
    }
    if (state.hit404) {
      trigger404Effect();
    }

    if (!isStealth) {
      trackSpamClick();
    }
  } finally {
    incrementInFlight = false;
  }
}

function checkFishPolice(state) {
  if (fishPoliceShown || spamMode || eggOverride) return;
  if (!state.lastClickAt) return;

  const idleMs = Date.now() - new Date(state.lastClickAt).getTime();
  if (idleMs >= FISH_IDLE_MS) {
    fishPoliceShown = true;
    showEggMessage(getRandomFishPolice(), 8000);
  }
}

function openResetModal() {
  resetConfirmText.textContent = getRandomResetConfirm();
  resetConfirmSub.textContent = getRandomResetConfirmSub();
  resetModal.classList.remove('hidden');
  resetModal.setAttribute('aria-hidden', 'false');
}

function closeResetModal() {
  resetModal.classList.add('hidden');
  resetModal.setAttribute('aria-hidden', 'true');
}

async function confirmReset() {
  closeResetModal();
  const state = await counterAPI.reset();
  render(state.count);
  statusVibeEl.classList.add('fade');
  setTimeout(() => statusVibeEl.classList.remove('fade'), 400);
  showToast(getRandomResetSuccess());
}

function showBossKey() {
  bossOverlay.classList.remove('hidden');
  bossOverlay.setAttribute('aria-hidden', 'false');
}

function hideBossKey() {
  bossOverlay.classList.add('hidden');
  bossOverlay.setAttribute('aria-hidden', 'true');
}

tapRegion.addEventListener('click', (e) => {
  e.preventDefault();
  handleIncrement(e);
});

tapRegion.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    handleIncrement({ ctrlKey: e.ctrlKey });
  }
});

countRingEl.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  e.stopPropagation();
  showBossKey();
});

bossOverlay.addEventListener('click', hideBossKey);
bossOverlay.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  hideBossKey();
});

resetBtn.addEventListener('click', (e) => {
  e.preventDefault();
  e.stopPropagation();
  openResetModal();
});

resetCancel.addEventListener('click', closeResetModal);
resetConfirm.addEventListener('click', confirmReset);

resetModal.addEventListener('click', (e) => {
  if (e.target === resetModal) closeResetModal();
});

function handleStateUpdate(state) {
  const wasReset = state.didReset;
  if (!stealthDisplay) {
    render(state.count);
  } else {
    currentCount = state.count;
    applyHeat(state.count);
    applyMood(state.count);
  }
  if (wasReset) {
    handleDailyRebirth(state);
    stealthDisplay = false;
    render(state.count);
  }
  checkFishPolice(state);
}

counterAPI.onStateUpdated(handleStateUpdate);

window.addEventListener('focus', () => {
  counterAPI.checkDate().then(handleStateUpdate);
});

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    counterAPI.checkDate().then(handleStateUpdate);
  }
});

setInterval(() => {
  counterAPI.getState().then(checkFishPolice);
}, 60 * 1000);

counterAPI.getState().then((state) => {
  render(state.count);
  if (state.didReset) {
    handleDailyRebirth(state);
  }
  checkFishPolice(state);
});

startTruthMarquee();
