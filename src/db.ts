import Dexie, { Table } from 'dexie'

export interface DraftPick {
  id?: number
  session: string
  playerId: number
  timestamp: number
}

export interface PlayerFlag {
  id?: number
  playerId: number
  color: string
}

class DraftDB extends Dexie {
  picks!: Table<DraftPick, number>
  flags!: Table<PlayerFlag, number>

  constructor() {
    super('draftDB')
    this.version(1).stores({
      picks: '++id,session,playerId,timestamp',
    })
    this.version(2).stores({
      picks: '++id,session,playerId,timestamp',
      flags: '++id,playerId,color',
    })
  }
}

export const db = new DraftDB()
