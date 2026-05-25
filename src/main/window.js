const path = require('path');
const { BrowserWindow, screen } = require('electron');
const { getWindowBounds, setWindowBounds } = require('./storage');

const WINDOW_WIDTH = 260;
const WINDOW_HEIGHT = 228;

function clampBounds(bounds) {
  const displays = screen.getAllDisplays();
  let { x, y, width, height } = bounds;

  if (x === undefined || y === undefined) {
    const primary = screen.getPrimaryDisplay();
    const work = primary.workArea;
    x = Math.round(work.x + (work.width - WINDOW_WIDTH) / 2);
    y = Math.round(work.y + (work.height - WINDOW_HEIGHT) / 2);
  }

  width = width || WINDOW_WIDTH;
  height = height || WINDOW_HEIGHT;

  const allAreas = displays.map((d) => d.workArea);
  const minX = Math.min(...allAreas.map((a) => a.x));
  const minY = Math.min(...allAreas.map((a) => a.y));
  const maxX = Math.max(...allAreas.map((a) => a.x + a.width));
  const maxY = Math.max(...allAreas.map((a) => a.y + a.height));

  const margin = 40;
  if (x + width < minX + margin) x = minX + margin;
  if (y + height < minY + margin) y = minY + margin;
  if (x > maxX - margin) x = maxX - width - margin;
  if (y > maxY - margin) y = maxY - height - margin;

  return { x, y, width, height };
}

function createMainWindow() {
  const saved = getWindowBounds();
  const bounds = clampBounds({
    x: saved.x,
    y: saved.y,
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
  });

  const win = new BrowserWindow({
    x: bounds.x,
    y: bounds.y,
    width: bounds.width,
    height: bounds.height,
    frame: false,
    transparent: true,
    resizable: false,
    alwaysOnTop: true,
    skipTaskbar: false,
    hasShadow: true,
    vibrancy: 'under-window',
    visualEffectState: 'active',
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.loadFile(path.join(__dirname, '../renderer/index.html'));

  const persistPosition = () => {
    if (win.isDestroyed()) return;
    const [x, y] = win.getPosition();
    setWindowBounds({ x, y, width: WINDOW_WIDTH, height: WINDOW_HEIGHT });
  };

  win.on('moved', persistPosition);
  win.on('close', persistPosition);

  return win;
}

module.exports = { createMainWindow, clampBounds };
