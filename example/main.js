import { app, BrowserWindow } from 'electron';
import * as path from 'path';

let mainWindow = null;

app.on('window-all-closed', () => {
  app.quit();
});

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 300,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.loadURL(`file://${__dirname}/index.html`);
});
