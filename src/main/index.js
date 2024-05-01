import { app, shell, BrowserWindow, ipcMain } from 'electron'
import path, { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { existsSync, readFileSync, writeFileSync, readdirSync } from 'fs'
const os = require('os');
const pty = require('node-pty');

const userDataPath = app.getPath('userData')
let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    minWidth:500,
    height: 670,
    minHeight: 500,
    show: false,
    autoHideMenuBar: true,
    title: 'Pokedex',
    ...(process.platform === 'linux' || 'windows' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    setupPtyListeners()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })


  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

ipcMain.on('ping', () => console.log('pong'))

ipcMain.on('saveAppState', (event, AppState) => {
  const filePath = path.join(userDataPath, 'AppState.json')
  writeFileSync(filePath, JSON.stringify(AppState, null, 4))
  console.log("Saved the AppState", filePath)
})

ipcMain.on('loadAppState', (event) => {
  const filePath = path.join(userDataPath, 'AppState.json');
  if (existsSync(filePath)) {
      const appState = readFileSync(filePath, 'utf-8');
      event.reply('app-state-loaded', JSON.parse(appState));
  }
  });

function readDirectoryRecursively(dir) {
  let results = [];
  const dirents = readdirSync(dir, { withFileTypes: true });
  for (const dirent of dirents) {
    const res = path.resolve(dir, dirent.name);
    if (dirent.isDirectory()) {
      results.push({
        name: dirent.name,
        isDirectory: true,
        children: readDirectoryRecursively(res)
      });
    } else {
      results.push({
        name: dirent.name,
        isDirectory: false
      });
    }
  }
  return results;
}

// IPC event handler
ipcMain.on('get-files-from-path', async (event, dirPath) => {
  try {
    const files = readDirectoryRecursively(dirPath);
    event.reply('files-received', files);
  } catch (err) {
    console.error('Failed to read directory:', err);
    event.reply('files-received', []);
  }
});



let ptyProcess
const ptyShell = os.platform() === 'win32' ? 'powershell.exe' : 'bash'

ptyProcess = pty.spawn(ptyShell, [], {
  name: 'xterm-color',
  cols: 80,
  rows: 30,
  cwd: process.env.HOME,
  env: process.env
})

ipcMain.on('terminal-resized', (event, cols, rows) => {
  ptyProcess.resize(cols, rows)
})

ipcMain.handle('handle-terminal-data', (e, data) => {
  ptyProcess.write(data);
});

function setupPtyListeners(){
  ptyProcess.onData((data) => {
    mainWindow.webContents.send('terminal-data', data);
  })
}