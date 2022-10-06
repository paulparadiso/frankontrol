const { contextBridge, ipcRenderer } = require('electron')

console.log('loading preload');

contextBridge.exposeInMainWorld('mediaAPI', {
    setCurrentTime: (time) => ipcRenderer.send('current-time', time)
})