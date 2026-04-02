import path from 'path'
import os from 'os'
import { app, dialog, ipcMain } from 'electron'
import serve from 'electron-serve'
import Store from 'electron-store'
import { promises as fs } from 'fs'
import extract from 'extract-zip'
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

const normalizeFolderName = (name: string) => {
  const normalized = name.trim().replace(/[\\/:*?"<>|]+/g, '-')
  return normalized.length > 0 ? normalized : 'project'
}

ipcMain.handle(
  'project:generate',
  async (
    _event,
    payload: { zipData: number[]; outputLocation: string; projectName: string }
  ) => {
    if (!payload || !Array.isArray(payload.zipData)) {
      throw new Error('Invalid zip payload')
    }
    if (typeof payload.outputLocation !== 'string' || !payload.outputLocation) {
      throw new Error('Output location is required')
    }
    if (typeof payload.projectName !== 'string' || !payload.projectName.trim()) {
      throw new Error('Project name is required')
    }

    const finalProjectName = normalizeFolderName(payload.projectName)
    const targetDir = path.join(payload.outputLocation, finalProjectName)
    const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'spring-init-'))
    const zipPath = path.join(tempRoot, 'starter.zip')
    const extractedRoot = path.join(tempRoot, 'extracted')

    try {
      await fs.access(targetDir)
      throw new Error(`Target folder already exists: ${targetDir}`)
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        throw error
      }
    }

    try {
      await fs.mkdir(extractedRoot, { recursive: true })
      await fs.writeFile(zipPath, Buffer.from(payload.zipData))
      await extract(zipPath, { dir: extractedRoot })

      const extractedEntries = await fs.readdir(extractedRoot, {
        withFileTypes: true,
      })
      const extractedFolder = extractedEntries.find((entry) =>
        entry.isDirectory()
      )
      if (!extractedFolder) {
        throw new Error('Extracted project folder not found')
      }

      const extractedProjectPath = path.join(extractedRoot, extractedFolder.name)
      await fs.rename(extractedProjectPath, targetDir)

      return { path: targetDir }
    } finally {
      await fs.rm(tempRoot, { recursive: true, force: true })
    }
  }
)
