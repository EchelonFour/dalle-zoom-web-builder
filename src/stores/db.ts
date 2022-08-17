import Dexie from 'dexie'
import type { Table } from 'dexie'

export interface Frame {
  id?: number
  rawUpload: Blob
  featheredFrame?: Blob
  nextFrameFeed?: Blob
}
export interface KeyValue<T> {
  key: string
  value: T
}

export class DalleZoomDexie extends Dexie {
  frames!: Table<Frame, number>

  settings!: Table<KeyValue<unknown>, string>

  constructor() {
    super('dalleZoom')
    this.version(1).stores({
      frames: '++id',
      settings: 'key',
    })
  }

  private async getSettingValue<T>(key: string, defaultValue: T): Promise<T> {
    const result = await this.settings.get(key)
    if (!result) {
      await this.settings.add({ key, value: defaultValue })
    }
    return result ? (result.value as T) : defaultValue
  }

  async getInfillPercent(): Promise<number> {
    return this.getSettingValue('infillPercent', 0.333333)
  }
}

export const db = new DalleZoomDexie()