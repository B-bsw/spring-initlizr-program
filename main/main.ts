import path from 'path'
import { app, dialog, ipcMain } from 'electron'
import serve from 'electron-serve'
import Store from 'electron-store'
import { createWindow } from './helpers/create-window'

const isProd = process.env.NODE_ENV === 'production'
const store = new Store<{ outputLocation: string }>({ name: 'preferences' })

if (isProd) {
  serve({ directory: 'app' })
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`)
}

;(async () => {
  await app.whenReady()

  const mainWindow = createWindow('main', {
    width: 1000,
    height: 600,
    webPreferences: {
      preload: path.join(import.meta.dirname, 'preload.js'),
    },
  })

  if (isProd) {
    await mainWindow.loadURL('app://./home')
  } else {
    const port = process.argv[2]
    await mainWindow.loadURL(`http://localhost:${port}/home`)
    mainWindow.webContents.openDevTools()
  }
})()

app.on('window-all-closed', () => {
  app.quit()
})

ipcMain.handle('output-location:get', () => {
  return store.get('outputLocation', '')
})

ipcMain.handle('output-location:home', () => {
  return app.getPath('home')
})

ipcMain.handle('output-location:pick', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory', 'createDirectory'],
  })
  if (result.canceled || result.filePaths.length === 0) {
    return null
  }
  const selectedPath = result.filePaths[0]
  store.set('outputLocation', selectedPath)
  return selectedPath
})

ipcMain.on('output-location:set', (_event, value: unknown) => {
  if (typeof value !== 'string') {
    return
  }
  store.set('outputLocation', value)
})

ipcMain.on('message', async (event, arg) => {
  event.reply('message', `${arg} World!`)
})
