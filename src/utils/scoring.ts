import { Player } from '../store'
import { ScoreWeights } from '../state/scoringStore'

export interface ScoreContext {
  byeWeekCounts: Record<number, number>
  rosterNeeds: Record<string, number>
}

export function scorePlayer(
  player: Player,
  weights: ScoreWeights,
  ctx: ScoreContext
): number {
  const vor = (player.vor ?? 0) * weights.vor
  const dropOff = (player.dropOff ?? 0) * weights.dropoff
  const byeAdj = -(ctx.byeWeekCounts[player.byeWeek ?? -1] ?? 0) * weights.bye
  const need = (ctx.rosterNeeds[player.position] ?? 0) * weights.need
  const flag = (player.flagBoost ?? 0) * weights.flag
  return vor + dropOff + byeAdj + need + flag
}
