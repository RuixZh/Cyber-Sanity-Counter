const { app, BrowserWindow, ipcMain, powerMonitor } = require('electron');
const { getLocalDateString, applyDailyResetIfNeeded } = require('../shared/dateGuard');
const { isLateNightHour } = require('../shared/copy');
const { readState, writeCount, writeLastClickAt } = require('./storage');
const { createMainWindow } = require('./window');

/** @type {BrowserWindow | null} */
let mainWindow = null;

function broadcastState(payload) {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('state-updated', payload);
  }
}

function toPayload(state, extra = {}) {
  return {
    count: state.count,
    lastResetDate: state.lastResetDate,
    today: getLocalDateString(),
    lastClickAt: state.lastClickAt ?? null,
    didReset: !!state.didReset,
    previousCount: state.previousCount,
    ...extra,
  };
}

function getFullState() {
  const state = readState();
  return toPayload(state);
}

function incrementCount() {
  let state = readState();
  let { count, lastResetDate } = state;
  const reset = applyDailyResetIfNeeded({ count, lastResetDate });
  count = reset.count;
  lastResetDate = reset.lastResetDate;

  const now = new Date();
  let delta = 1;
  let doubleMerit = false;
  if (isLateNightHour(now)) {
    delta = 2;
    doubleMerit = true;
  }

  count += delta;
  writeCount(count, lastResetDate);
  writeLastClickAt(now.toISOString());

  const hit404 = count === 404;

  return toPayload(
    { count, lastResetDate, lastClickAt: now.toISOString() },
    {
      incrementDelta: delta,
      doubleMerit,
      hit404,
      didReset: reset.didReset,
    }
  );
}

function resetCount() {
  const today = getLocalDateString();
  writeCount(0, today);
  return toPayload({ count: 0, lastResetDate: today, lastClickAt: null });
}

function setupIpc() {
  ipcMain.handle('get-state', () => getFullState());

  ipcMain.handle('check-date', () => {
    const state = readState();
    const payload = toPayload(state);
    if (state.didReset) {
      broadcastState(payload);
    }
    return payload;
  });

  ipcMain.handle('increment', () => incrementCount());
  ipcMain.handle('reset', () => resetCount());
  ipcMain.handle('shake-window', (_event, profile) => shakeWindow(profile));
}

function shakeWindow(profile = {}) {
  return new Promise((resolve) => {
    const win = mainWindow;
    if (!win || win.isDestroyed()) {
      resolve();
      return;
    }

    const shakes = Math.max(2, Math.min(Math.round(Number(profile.shakes) || 4), 20));
    const amplitude = Math.max(
      1,
      Math.min(Math.round(Number(profile.amplitude) || 3), 12)
    );
    const intervalMs = Math.max(10, Math.min(Math.round(Number(profile.intervalMs) || 28), 50));
    const [rawX, rawY] = win.getPosition();
    const originX = Math.round(Number(rawX) || 0);
    const originY = Math.round(Number(rawY) || 0);
    let step = 0;

    const tick = () => {
      if (win.isDestroyed()) {
        resolve();
        return;
      }
      if (step >= shakes) {
        win.setPosition(originX, originY);
        resolve();
        return;
      }
      const dx = (step % 2 === 0 ? 1 : -1) * amplitude;
      const dy = ((step >> 1) % 2 === 0 ? 1 : -1) * Math.max(1, Math.floor(amplitude * 0.55));
      win.setPosition(Math.round(originX + dx), Math.round(originY + dy));
      step += 1;
      setTimeout(tick, intervalMs);
    };

    tick();
  });
}

function setupDatePolling() {
  setInterval(() => {
    const state = readState();
    if (state.didReset) {
      broadcastState(toPayload(state));
    }
  }, 60 * 1000);
}

function setupPowerMonitor() {
  powerMonitor.on('resume', () => {
    const state = readState();
    broadcastState(toPayload(state));
  });
}

app.whenReady().then(() => {
  setupIpc();
  readState();
  mainWindow = createMainWindow();
  setupDatePolling();
  setupPowerMonitor();

  mainWindow.on('focus', () => {
    const state = readState();
    broadcastState(toPayload(state));
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      mainWindow = createMainWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
