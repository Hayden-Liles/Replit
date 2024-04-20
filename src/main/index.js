import { app, shell, BrowserWindow, ipcMain } from 'electron'
import path, { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { existsSync, readFileSync, writeFileSync, readdir } from 'fs'
const os = require('os');
const pty = require('node-pty');

let ptyProcess
let terminal

const userDataPath = app.getPath('userData')

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
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

  function initializePtyProcess() {
    const shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';
    ptyProcess = pty.spawn(shell, [], {
      name: 'xterm-color',
      cols: 80,
      rows: 30,
      cwd: process.env.HOME,
      env: process.env
    });

    if (!ptyProcess) {
      console.error('Failed to initialize ptyProcess');
      return;
    }

    ptyProcess.onData((data) => {
      mainWindow.webContents.send('terminal-data', data);
    })
  }



  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    initializePtyProcess()
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

function createTerminal() {
  if (!terminal) {  // Only create a new terminal if one doesn't already exist
    const shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';
    terminal = pty.spawn(shell, [], {
      name: 'xterm-color',
      cols: 80,
      rows: 30,
      cwd: process.env.HOME,
      env: process.env
    });


    terminal.on('data', (data) => {
      // Send data back to the renderer process
      BrowserWindow.getAllWindows().forEach((win) => {
        win.webContents.send('terminal-from-backend', data);
      });
    });

    
  }
  return terminal;
}

let commandBuffer = '';

ipcMain.on('terminal-to-backend', (event, data) => {
  console.log("DATA RECIEVED :: ", data)
  const terminalInstance = createTerminal();

  if (data == '\r' && commandBuffer.trim() == 'clear'){
    terminalInstance.write(data);
    terminalInstance.clear()
    commandBuffer = ''
    console.log('clearing')
  } else if (data == '\r') {
    console.log(commandBuffer.trim())
    commandBuffer = ''
    terminalInstance.write(data);
  }
  else{
    commandBuffer += data
    terminalInstance.write(data);
  }
});

ipcMain.on('request-initial-data', () => {
  const terminal = createTerminal();
  terminal.clear()
});

ipcMain.on('get-files-from-path', (event, dirPath) => {
  readdir(dirPath, { withFileTypes: true }, (err, dirents) => {
    if (err) {
      console.error('Failed to read directory:', err);
      event.reply('files-received', []); // Send empty array on error
      return;
    }
    const files = dirents.map(dirent => ({
      name: dirent.name,
      isDirectory: dirent.isDirectory(),
    }));
    event.reply('files-received', files);
  });
});
