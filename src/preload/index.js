import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

const combinedAPI = {
  ...electronAPI,
  saveAppState: (appState) => ipcRenderer.send('saveAppState', appState),
  loadAppState: () => ipcRenderer.send('loadAppState'),
  onAppStateLoaded: (callback) => ipcRenderer.on('app-state-loaded', (event, appState) => callback(appState)),
  getFilesFromPath: (path) => ipcRenderer.send('get-files-from-path', path),
  onFilesReceived: (callback) => ipcRenderer.on('files-received', (event, files) => callback(files)),
  // sendTerminalData: (data) => ipcRenderer.send('terminal-to-backend', data),
  // onTerminalData: (callback) => ipcRenderer.on('terminal-from-backend', (event, data) => callback(data)),
  // requestInitialData: () => ipcRenderer.send('request-initial-data'),
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', combinedAPI);
  } catch (error) {
    console.error(error);
  }
}
