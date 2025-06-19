import { useDraftStore } from '../store'
import { useScoredPlayers } from '../hooks/useScoredPlayers'

export default function PlayerList() {
  const players = useScoredPlayers()
  const picks = useDraftStore((s) => s.picks)
  const toggleTaken = useDraftStore((s) => s.toggleTaken)

  const isTaken = (id: number) => picks.some((p) => p.playerId === id)

  return (
    <div>
      <h2>Available Players</h2>
      <ul>
        {players
          .filter((p) => !isTaken(p.id))
          .map((p) => (
            <li key={p.id}>
              {p.name} ({p.position}-{p.team}) - {p.score.toFixed(2)}{' '}
              <button onClick={() => toggleTaken(p.id)}>Taken</button>
            </li>
          ))}
      </ul>
    </div>
  )
}
