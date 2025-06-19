import { create } from 'zustand'

export interface ScoreWeights {
  vor: number
  dropoff: number
  bye: number
  need: number
  flag: number
}

interface ScoringState {
  weights: ScoreWeights
  setWeights: (w: Partial<ScoreWeights>) => void
}

const defaultWeights: ScoreWeights = {
  vor: 1,
  dropoff: 1,
  bye: 1,
  need: 1,
  flag: 1,
}

export const useScoringStore = create<ScoringState>((set) => ({
  weights: defaultWeights,
  setWeights: (w) => set((state) => ({ weights: { ...state.weights, ...w } })),
}))
