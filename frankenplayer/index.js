const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
require('electron-debug')({ showDevTools: false });

const activeInterfaces = ['udp'];
const interfaces = {};

const interfaceCallback = command => {
    console.log(command);
}

const config = {'callback': interfaceCallback, 'port': 5566};

const loadInterfaces = () => {
    activeInterfaces.map(interface => {
        interfaces.interface = require(`./interfaces/${interface}`)(config);
    })
}

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1920,
        height: 1080,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    ipcMain.on('current-time', (event, time) => {
        console.log(time);
    })

    win.loadFile('index.html');

    loadInterfaces();
}

app.whenReady().then(() => {
    createWindow();
})  