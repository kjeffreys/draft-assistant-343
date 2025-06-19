import { useDraftStore } from '../store'

export default function DraftPicks() {
  const picks = useDraftStore((s) => s.picks)
  const players = useDraftStore((s) => s.players)
  const undoPick = useDraftStore((s) => s.undoPick)

  const sorted = [...picks].sort((a, b) => a.timestamp - b.timestamp)

  return (
    <div>
      <h2>Draft Picks</h2>
      <ol>
        {sorted.map((p) => {
          const player = players.find((pl) => pl.id === p.playerId)
          if (!player) return null
          return (
            <li key={p.id}>
              {player.name}{' '}
              <button onClick={() => undoPick(p.id!)}>Undo</button>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
