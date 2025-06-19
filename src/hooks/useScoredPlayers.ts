import { useMemo } from 'react'
import { useDraftStore, Player } from '../store'
import { useLeagueStore } from '../state/leagueStore'
import { useScoringStore } from '../state/scoringStore'
import { scorePlayer, ScoreContext } from '../utils/scoring'

export interface ScoredPlayer extends Player {
  score: number
}

export function useScoredPlayers(): ScoredPlayer[] {
  const players = useDraftStore((s) => s.players)
  const picks = useDraftStore((s) => s.picks)
  const rosterSlots = useLeagueStore((s) => s.rosterSlots)
  const weights = useScoringStore((s) => s.weights)

  return useMemo(() => {
    const byeWeekCounts: Record<number, number> = {}
    const positionCounts: Record<string, number> = {}

    for (const pick of picks) {
      const player = players.find((p) => p.id === pick.playerId)
      if (!player) continue
      if (player.byeWeek !== undefined) {
        byeWeekCounts[player.byeWeek] =
          (byeWeekCounts[player.byeWeek] || 0) + 1
      }
      positionCounts[player.position] =
        (positionCounts[player.position] || 0) + 1
    }

    const maxPositions: Record<string, number> = {}
    for (const slot of rosterSlots) {
      maxPositions[slot] = (maxPositions[slot] || 0) + 1
    }

    const rosterNeeds: Record<string, number> = {}
    for (const pos in maxPositions) {
      rosterNeeds[pos] = Math.max(
        0,
        maxPositions[pos] - (positionCounts[pos] || 0)
      )
    }

    const ctx: ScoreContext = { byeWeekCounts, rosterNeeds }

    const scored = players.map((p) => ({
      ...p,
      score: scorePlayer(p, weights, ctx),
    }))

    return scored.sort((a, b) => b.score - a.score)
  }, [players, picks, rosterSlots, weights])
}
