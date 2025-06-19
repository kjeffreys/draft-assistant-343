import { create } from 'zustand'
import { db, DraftPick } from './db'

export interface Player {
  id: number
  name: string
  position: string
  team: string
}

interface DraftState {
  players: Player[]
  picks: DraftPick[]
  loadPlayers: () => Promise<void>
  toggleTaken: (playerId: number) => Promise<void>
  undoPick: (id: number) => Promise<void>
}

export const useDraftStore = create<DraftState>((set, get) => ({
  players: [],
  picks: [],
  loadPlayers: async () => {
    const res = await fetch('/players_2024.json')
    const players: Player[] = await res.json()
    const picks = await db.picks.toArray()
    set({ players, picks })
  },
  toggleTaken: async (playerId: number) => {
    const state = get()
    const existing = state.picks.find((p) => p.playerId === playerId)
    if (existing && existing.id !== undefined) {
      await db.picks.delete(existing.id)
      set({ picks: state.picks.filter((p) => p.playerId !== playerId) })
    } else {
      const pick: DraftPick = { playerId, timestamp: Date.now() }
      const id = await db.picks.add(pick)
      set({ picks: [...state.picks, { ...pick, id }] })
    }
  },
  undoPick: async (id: number) => {
    await db.picks.delete(id)
    set((state) => ({ picks: state.picks.filter((p) => p.id !== id) }))
  },
}))
