import { create } from 'zustand'

interface LeagueState {
  rosterSlots: string[]
  setRosterSlots: (slots: string[]) => void
}

export const useLeagueStore = create<LeagueState>((set) => ({
  rosterSlots: [],
  setRosterSlots: (slots) => set({ rosterSlots: slots }),
}))
