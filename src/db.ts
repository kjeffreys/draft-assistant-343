import Dexie, { Table } from 'dexie'

export interface DraftPick {
  id?: number
  playerId: number
  timestamp: number
}

class DraftDB extends Dexie {
  picks!: Table<DraftPick, number>

  constructor() {
    super('draftDB')
    this.version(1).stores({
      picks: '++id,playerId,timestamp',
    })
  }
}

export const db = new DraftDB()
