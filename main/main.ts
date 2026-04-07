import path from 'path'
import os from 'os'
import { app, dialog, ipcMain } from 'electron'
import serve from 'electron-serve'
import Store from 'electron-store'
import { promises as fs } from 'fs'
import extract from 'extract-zip'
import { createWindow } from './helpers/create-window'

const isProd = process.env.NODE_ENV === 'production'
const store = new Store<{ outputLocation: string; theme: 'light' | 'dark' }>({
  name: 'preferences',
})

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
  mainWindow.maximize()

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

ipcMain.handle('theme:get', () => {
  return store.get('theme', 'light')
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

ipcMain.on('theme:set', (_event, value: unknown) => {
  if (value !== 'light' && value !== 'dark') {
    return
  }
  store.set('theme', value)
})

ipcMain.on('message', async (event, arg) => {
  event.reply('message', `${arg} World!`)
})

const normalizeFolderName = (name: string) => {
  const normalized = name.trim().replace(/[\\/:*?"<>|]+/g, '-')
  return normalized.length > 0 ? normalized : 'project'
}

type StarterZipRequestPayload = {
  type: string
  language: string
  bootVersion: string
  baseDir: string
  groupId: string
  artifactId: string
  packageName: string
  packaging: string
  javaVersion: string
  configurationFileFormat: string
  dependencies: string[]
}

const buildStarterZipUrl = (payload: StarterZipRequestPayload) => {
  const params = new URLSearchParams({
    type: payload.type,
    language: payload.language,
    bootVersion: payload.bootVersion,
    baseDir: payload.baseDir,
    groupId: payload.groupId,
    artifactId: payload.artifactId,
    packageName: payload.packageName,
    packaging: payload.packaging,
    javaVersion: payload.javaVersion,
    configurationFileFormat: payload.configurationFileFormat,
  })
  if (payload.dependencies.length > 0) {
    params.set('dependencies', payload.dependencies.join(','))
  }
  return `https://start.spring.io/starter.zip?${params.toString()}`
}

const listRelativePaths = async (rootDir: string) => {
  const walk = async (currentDir: string): Promise<string[]> => {
    const entries = await fs.readdir(currentDir, { withFileTypes: true })
    const results: string[] = []
    for (const entry of entries) {
      const absolutePath = path.join(currentDir, entry.name)
      const relativePath = path
        .relative(rootDir, absolutePath)
        .split(path.sep)
        .join('/')
      if (entry.isDirectory()) {
        results.push(`${relativePath}/`)
        const nested = await walk(absolutePath)
        results.push(...nested)
      } else {
        results.push(relativePath)
      }
    }
    return results
  }
  const listed = await walk(rootDir)
  return listed.sort((a, b) => a.localeCompare(b))
}

ipcMain.handle(
  'project:starter-zip',
  async (_event, payload: StarterZipRequestPayload) => {
    if (!payload || typeof payload !== 'object') {
      throw new Error('Invalid starter payload')
    }
    const requiredStringFields: Array<keyof Omit<StarterZipRequestPayload, 'dependencies'>> = [
      'type',
      'language',
      'bootVersion',
      'baseDir',
      'groupId',
      'artifactId',
      'packageName',
      'packaging',
      'javaVersion',
      'configurationFileFormat',
    ]
    for (const field of requiredStringFields) {
      if (typeof payload[field] !== 'string' || !payload[field].trim()) {
        throw new Error(`Invalid starter field: ${field}`)
      }
    }
    if (!Array.isArray(payload.dependencies)) {
      throw new Error('Invalid dependencies')
    }

    const response = await fetch(buildStarterZipUrl(payload), {
      method: 'GET',
      headers: {
        Accept: 'application/zip',
      },
    })
    if (!response.ok) {
      throw new Error(`Generate failed (${response.status})`)
    }
    const arrayBuffer = await response.arrayBuffer()
    return Array.from(new Uint8Array(arrayBuffer))
  }
)

ipcMain.handle(
  'project:zip-entries',
  async (_event, payload: { zipData: number[] }) => {
    if (!payload || !Array.isArray(payload.zipData)) {
      throw new Error('Invalid zip payload')
    }
    const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'spring-zip-tree-'))
    const zipPath = path.join(tempRoot, 'starter.zip')
    const extractedRoot = path.join(tempRoot, 'extracted')
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
      return listRelativePaths(extractedProjectPath)
    } finally {
      await fs.rm(tempRoot, { recursive: true, force: true })
    }
  }
)

ipcMain.handle(
  'project:zip-file-content',
  async (_event, payload: { zipData: number[]; filePath: string }) => {
    if (!payload || !Array.isArray(payload.zipData)) {
      throw new Error('Invalid zip payload')
    }
    if (typeof payload.filePath !== 'string' || !payload.filePath.trim()) {
      throw new Error('File path is required')
    }

    const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'spring-zip-file-'))
    const zipPath = path.join(tempRoot, 'starter.zip')
    const extractedRoot = path.join(tempRoot, 'extracted')
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
      const normalizedRelativePath = payload.filePath
        .split('/')
        .filter(Boolean)
        .join(path.sep)
      const requestedPath = path.join(extractedProjectPath, normalizedRelativePath)
      const relativeCheck = path.relative(extractedProjectPath, requestedPath)
      if (
        relativeCheck.startsWith('..') ||
        path.isAbsolute(relativeCheck) ||
        payload.filePath.endsWith('/')
      ) {
        throw new Error('Invalid file path')
      }
      const stat = await fs.stat(requestedPath)
      if (!stat.isFile()) {
        throw new Error('Requested path is not a file')
      }
      return fs.readFile(requestedPath, 'utf8')
    } finally {
      await fs.rm(tempRoot, { recursive: true, force: true })
    }
  }
)

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
