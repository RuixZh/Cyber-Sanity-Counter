const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('counterAPI', {
  getState: () => ipcRenderer.invoke('get-state'),
  checkDate: () => ipcRenderer.invoke('check-date'),
  increment: () => ipcRenderer.invoke('increment'),
  reset: () => ipcRenderer.invoke('reset'),
  shakeWindow: (profile) => ipcRenderer.invoke('shake-window', profile),
  onStateUpdated: (callback) => {
    const handler = (_event, state) => callback(state);
    ipcRenderer.on('state-updated', handler);
    return () => ipcRenderer.removeListener('state-updated', handler);
  },
});
