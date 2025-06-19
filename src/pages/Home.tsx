import { useEffect } from 'react'
import PlayerList from '../components/PlayerList'
import DraftPicks from '../components/DraftPicks'
import { useDraftStore } from '../store'

export default function Home() {
  const loadPlayers = useDraftStore((s) => s.loadPlayers)

  useEffect(() => {
    loadPlayers()
  }, [loadPlayers])

  return (
    <main>
      <h1>Fantasy Draft Assistant</h1>
      <div style={{ display: 'flex', gap: '2rem' }}>
        <PlayerList />
        <DraftPicks />
      </div>
    </main>
  )
}
