import { FormEvent, useState } from 'react'
import { useLeagueStore } from '../state/leagueStore'

export default function ImportLeague() {
  const [leagueId, setLeagueId] = useState('')
  const setRosterSlots = useLeagueStore((s) => s.setRosterSlots)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!leagueId) return
    try {
      const resp = await fetch(
        `https://api.sleeper.app/v1/league/${leagueId}`
      )
      if (!resp.ok) throw new Error('Failed to fetch league')
      const data = await resp.json()
      const slots = data.roster_positions || data.settings?.roster_positions
      if (Array.isArray(slots)) {
        setRosterSlots(slots)
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <main>
      <h1>Import League</h1>
      <form onSubmit={handleSubmit}>
        <label>
          League ID:
          <input
            value={leagueId}
            onChange={(e) => setLeagueId(e.target.value)}
          />
        </label>
        <button type="submit">Import</button>
      </form>
    </main>
  )
}
