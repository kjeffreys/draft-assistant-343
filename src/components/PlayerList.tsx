import { useMemo, useState } from 'react'
import Fuse from 'fuse.js'
import { useDraftStore } from '../store'
import { useScoredPlayers } from '../hooks/useScoredPlayers'
import { useAvailabilityModel, predictChance } from '../hooks/useAvailabilityModel'

export default function PlayerList() {
  const players = useScoredPlayers()
  const picks = useDraftStore((s) => s.picks)
  const toggleTaken = useDraftStore((s) => s.toggleTaken)
  const setFlagColor = useDraftStore((s) => s.setFlagColor)
  const availabilityModel = useAvailabilityModel()

  const [query, setQuery] = useState('')
  const [pos, setPos] = useState<string>('ALL')
  const [hideDrafted, setHideDrafted] = useState(true)
  const [hideInjured, setHideInjured] = useState(false)

  const isTaken = (id: number) => picks.some((p) => p.playerId === id)

  const tierBreaks = useMemo(() => {
    const sorted = [...players].sort((a, b) => (b.vor ?? 0) - (a.vor ?? 0))
    const breaks = new Set<number>()
    for (let i = 0; i < sorted.length - 1; i++) {
      const cur = sorted[i].vor ?? 0
      const next = sorted[i + 1].vor ?? 0
      if (cur - next >= 10) {
        breaks.add(sorted[i].id)
      }
    }
    return breaks
  }, [players])

  const filtered = players
    .filter((p) => (pos === 'ALL' ? true : p.position === pos))
    .filter((p) => (hideDrafted ? !isTaken(p.id) : true))
    .filter((p) => (hideInjured ? !p.injured : true))

  const fuse = useMemo(() => new Fuse(filtered, { keys: ['name', 'team'] }), [filtered])

  const results = query ? fuse.search(query).map((r) => r.item) : filtered

  return (
    <div>
      <h2>Available Players</h2>
      <input
        placeholder="Search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div>
        {['ALL', 'QB', 'RB', 'WR', 'TE'].map((p) => (
          <button
            key={p}
            onClick={() => setPos(p)}
            style={{ fontWeight: pos === p ? 'bold' : 'normal' }}
          >
            {p}
          </button>
        ))}
      </div>
      <label>
        <input
          type="checkbox"
          checked={hideDrafted}
          onChange={(e) => setHideDrafted(e.target.checked)}
        />
        Hide Drafted
      </label>
      <label>
        <input
          type="checkbox"
          checked={hideInjured}
          onChange={(e) => setHideInjured(e.target.checked)}
        />
        Hide Injured
      </label>
      <ul>
        {results.map((p) => (
          <li key={p.id}>
            <span
              style={{
                backgroundColor: p.flagColor || 'transparent',
                padding: '0 0.25rem',
              }}
            >
              {p.name}
            </span>{' '}
            ({p.position}-{p.team}) - {p.score.toFixed(2)}{' '}
            <em>{(predictChance(availabilityModel, p) * 100).toFixed(0)}% chance lasts</em>{' '}
            {tierBreaks.has(p.id) && <span style={{ color: 'red' }}>⚠ Last Tier</span>}{' '}
            <button onClick={() => toggleTaken(p.id)}>
              {isTaken(p.id) ? 'Undo' : 'Taken'}
            </button>{' '}
            <input
              type="color"
              value={p.flagColor || '#ffffff'}
              onChange={(e) =>
                setFlagColor(
                  p.id,
                  e.target.value === '#ffffff' ? null : e.target.value
                )
              }
              style={{ verticalAlign: 'middle', marginLeft: '0.5rem' }}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
