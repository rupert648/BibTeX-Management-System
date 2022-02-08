const { contextBridge, ipcRenderer } = require('electron');

window.ipcRenderer = ipcRenderer;

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    myPing() {
      ipcRenderer.send('ipc-example', 'ping');
    },
    on(channel, func) {
      const validChannels = ['ipc-example', 'open-dialog'];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    },
    once(channel, func) {
      const validChannels = [
        'ipc-example',
        'open-dialog',
        'search-volume',
        'get-file-length',
        'parse-bibtex-file',
      ];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.once(channel, (event, ...args) => func(...args));
      }
    },
    openDialog() {
      ipcRenderer.send('open-dialog', 'hello');
    },
  },
});
