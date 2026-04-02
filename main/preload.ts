import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'

const handler = {
  send<T>(channel: string, value?: T) {
    ipcRenderer.send(channel, value)
  },
  invoke<T, V = undefined>(channel: string, value?: V) {
    return ipcRenderer.invoke(channel, value) as Promise<T>
  },
  on<T>(channel: string, callback: (...args: T[]) => void) {
    const subscription = (_event: IpcRendererEvent, ...args: T[]) =>
      callback(...args)
    ipcRenderer.on(channel, subscription)

    return () => {
      ipcRenderer.removeListener(channel, subscription)
    }
  },
}

contextBridge.exposeInMainWorld('ipc', handler)

export type IpcHandler = typeof handler
