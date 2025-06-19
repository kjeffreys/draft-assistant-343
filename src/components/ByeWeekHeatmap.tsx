import { useMemo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { useDraftStore } from '../store'
import { useLeagueStore } from '../state/leagueStore'

export default function ByeWeekHeatmap() {
  const players = useDraftStore((s) => s.players)
  const picks = useDraftStore((s) => s.picks)
  const rosterSlots = useLeagueStore((s) => s.rosterSlots)

  const { data, warnings } = useMemo(() => {
    const maxPositions: Record<string, number> = {}
    rosterSlots.forEach((pos) => {
      maxPositions[pos] = (maxPositions[pos] || 0) + 1
    })

    const takenByPos: Record<string, number> = {}
    const starters: number[] = []
    const sorted = [...picks].sort((a, b) => a.timestamp - b.timestamp)
    for (const pick of sorted) {
      const player = players.find((p) => p.id === pick.playerId)
      if (!player) continue
      const pos = player.position
      if ((takenByPos[pos] || 0) < (maxPositions[pos] || 0)) {
        takenByPos[pos] = (takenByPos[pos] || 0) + 1
        starters.push(player.id)
      }
    }

    const weekCounts: Record<number, number> = {}
    starters.forEach((id) => {
      const player = players.find((p) => p.id === id)
      if (!player || player.byeWeek === undefined) return
      weekCounts[player.byeWeek] = (weekCounts[player.byeWeek] || 0) + 1
    })

    const warnings: number[] = []
    for (const w in weekCounts) {
      if (weekCounts[w] >= 3) warnings.push(Number(w))
    }

    const data = Array.from({ length: 18 }, (_, i) => ({
      week: i + 1,
      count: weekCounts[i + 1] || 0,
    }))

    return { data, warnings }
  }, [players, picks, rosterSlots])

  const colorScale = (count: number) => {
    if (count >= 3) return '#d73027'
    if (count === 2) return '#fc8d59'
    if (count === 1) return '#fee08b'
    return '#ffffbf'
  }

  if (!rosterSlots.length) return null

  return (
    <div>
      <h3>Starters By Bye Week</h3>
      <ResponsiveContainer width="100%" height={150}>
        <BarChart data={data} margin={{ left: -20, right: 10, top: 10, bottom: 0 }}>
          <XAxis dataKey="week" tickLine={false} />
          <YAxis hide />
          <Tooltip />
          <Bar dataKey="count">
            {data.map((d, idx) => (
              <Cell key={idx} fill={colorScale(d.count)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      {warnings.map((w) => (
        <div key={w} style={{ color: 'red' }}>
          ⚠ Many starters share bye week {w}
        </div>
      ))}
    </div>
  )
}
