import { useDraftStore } from '../store'

export default function PlayerList() {
  const players = useDraftStore((s) => s.players)
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
              {p.name} ({p.position}-{p.team}){' '}
              <button onClick={() => toggleTaken(p.id)}>Taken</button>
            </li>
          ))}
      </ul>
    </div>
  )
}
