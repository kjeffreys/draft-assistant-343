import { useDraftStore } from '../store'

export default function DraftPicks()
{
  const picks = useDraftStore((s) => s.picks)
  const players = useDraftStore((s) => s.players)
  const undoPick = useDraftStore((s) => s.undoPick)

  // show a visible fallback while the player pool is empty
  if (players.length === 0)
  {
    return <p style={{ color: 'red' }}>Waiting for players JSON…</p>
  }

  const sorted = [...picks].sort((a, b) => a.timestamp - b.timestamp)

  return (
    <div>
      <h2>Draft Picks</h2>
      <ol>
        {sorted.map((p) =>
        {
          const player = players.find((pl) => pl.id === p.playerId)

          // if the pick references an ID that isn’t in players yet
          if (!player)
          {
            return (
              <li key={p.id}>
                <em>loading…</em>
              </li>
            )
          }

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
