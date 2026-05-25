const Store = require('electron-store');
const { getLocalDateString, applyDailyResetIfNeeded } = require('../shared/dateGuard');

const defaults = {
  count: 0,
  lastResetDate: getLocalDateString(),
  lastClickAt: null,
  windowBounds: { x: undefined, y: undefined, width: 260, height: 228 },
};

const store = new Store({
  name: 'interruption-counter',
  defaults,
});

function readState() {
  const raw = {
    count: store.get('count', 0),
    lastResetDate: store.get('lastResetDate', getLocalDateString()),
  };
  const next = applyDailyResetIfNeeded(raw);
  const previousCount = next.didReset ? raw.count : undefined;
  if (next.didReset) {
    store.set('count', next.count);
    store.set('lastResetDate', next.lastResetDate);
  }
  return {
    count: next.count,
    lastResetDate: next.lastResetDate,
    didReset: next.didReset,
    previousCount,
    lastClickAt: store.get('lastClickAt', null),
  };
}

function writeCount(count, lastResetDate) {
  store.set('count', count);
  store.set('lastResetDate', lastResetDate);
}

function writeLastClickAt(isoString) {
  store.set('lastClickAt', isoString);
}

function getWindowBounds() {
  return store.get('windowBounds', defaults.windowBounds);
}

function setWindowBounds(bounds) {
  store.set('windowBounds', bounds);
}

module.exports = {
  readState,
  writeCount,
  writeLastClickAt,
  getWindowBounds,
  setWindowBounds,
  checkAndResetIfNewDay: readState,
};
