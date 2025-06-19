import Dexie, { Table } from 'dexie'

export interface DraftPick {
  id?: number
  session: string
  playerId: number
  timestamp: number
}

class DraftDB extends Dexie {
  picks!: Table<DraftPick, number>

  constructor() {
    super('draftDB')
    this.version(1).stores({
      picks: '++id,session,playerId,timestamp',
    })
  }
}

export const db = new DraftDB()
