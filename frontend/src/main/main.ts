/* eslint-disable import/no-extraneous-dependencies */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import path from 'path';
import { app, BrowserWindow, shell, ipcMain, dialog } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import backend from 'backend';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

// eslint-disable-next-line no-unused-vars
ipcMain.on('open-dialog', async (event, _arg) => {
  const result = await dialog.showOpenDialog({ properties: ['openDirectory'] });
  event.reply('open-dialog', result);
});

// eslint-disable-next-line no-unused-vars
ipcMain.on('select-file', async (event, _arg) => {
  const result = await dialog.showOpenDialog({ properties: ['promptToCreate'] });
  event.reply('select-file', result);
});

ipcMain.on('search-volume', async (event, arg) => {
  const result = backend.searchVolume(arg);
  event.reply('search-volume', result);
});

ipcMain.on('get-file-length', async (event, arg) => {
  const result = backend.getFileSize(arg.file);
  event.reply(`get-file-length-${arg.index}`, result);
});

ipcMain.on('parse-bibtex-file', async (event, arg) => {
  const result = backend.parseBibTexFile(arg.file);
  event.reply(`parse-bibtex-file-${arg.index}`, result);
});

ipcMain.on('merge', async (event, arg) => {
  // TODO: tinker
  const threshold = 0.28;
  const { files, resultPath } = arg;
  const result = backend.mergeBibTexFiles(files, resultPath, threshold);
  console.log(result);

  event.reply('merge-response', result);
});

// 'damerau_levenshtein',
//         'hamming',
//         'levenshtein',
//         'ngram',
//         'jenson shanning vector'

ipcMain.on('damerau-levenshtein', async (event, arg) => {
  const result = backend.damerauLevenshtein(arg.string1, arg.string2);
  event.reply('damerau-levenshtein', result);
})

ipcMain.on('hamming', async (event, arg) => {
  const result = backend.hamming(arg.string1, arg.string2);
  event.reply('hamming', result);
})

ipcMain.on('levenshtein', async (event, arg) => {
  const result = backend.levenshtein(arg.string1, arg.string2);
  event.reply('levenshtein', result);
})

ipcMain.on('ngram', async (event, arg) => {
  const result = backend.ngram(arg.string1, arg.string2, 2);
  event.reply('ngram', result);
})

ipcMain.on('jenson-shanning-vector', async (event, arg) => {
  const result = backend.jensonShanningVector(arg.string1, arg.string2);
  event.reply('jenson-shanning-vector', result);
})

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDevelopment =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDevelopment) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDevelopment) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string =>
    path.join(RESOURCES_PATH, ...paths);

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
