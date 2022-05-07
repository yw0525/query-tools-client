const { contextBridge, ipcRenderer } = require('electron');

const validChannels = ['connected', 'disconnected', 'execute'];

const EventEmitterOptions = {
  on(channel, func) {
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  },
  once(channel, func) {
    if (validChannels.includes(channel)) {
      ipcRenderer.once(channel, (event, ...args) => {
        func(...args);
      });
    }
  },
};

const DataBaseOptions = {
  connect(options) {
    ipcRenderer.send('connect', options);
  },
};

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    ...EventEmitterOptions,
    ...DataBaseOptions,
  },
});
