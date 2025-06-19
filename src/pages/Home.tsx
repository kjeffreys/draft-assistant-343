
import { useEffect } from 'react'
import PlayerList from '../components/PlayerList'
import DraftPicks from '../components/DraftPicks'
import ScoringSliders from '../components/ScoringSliders'
import ByeWeekHeatmap from '../components/ByeWeekHeatmap'
import { useDraftStore } from '../store'
import { Link } from 'react-router-dom'

export default function Home() {
  const loadPlayers = useDraftStore((s) => s.loadPlayers)

  useEffect(() => {
    loadPlayers()
  }, [loadPlayers])

  return (
    <main>
      <h1>Fantasy Draft Assistant</h1>
      <ScoringSliders />
      <div style={{ display: 'flex', gap: '2rem' }}>
        <PlayerList />
        <DraftPicks />
      </div>
      <ByeWeekHeatmap />
      <h1>Welcome to Fantasy Draft Assistant</h1>
      <p>Get ready to draft the perfect team!</p>
      <Link to="/import-league">Import League</Link>
    </main>
  )
}
