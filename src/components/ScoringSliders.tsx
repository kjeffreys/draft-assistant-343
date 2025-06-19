import { useScoringStore } from '../state/scoringStore'

const entries = [
  ['vor', 'VOR'],
  ['dropoff', 'Drop-Off'],
  ['bye', 'Bye Week'],
  ['need', 'Roster Need'],
  ['flag', 'Flag Boost'],
] as const

export default function ScoringSliders() {
  const weights = useScoringStore((s) => s.weights)
  const setWeights = useScoringStore((s) => s.setWeights)

  return (
    <div>
      <h3>Weighting</h3>
      {entries.map(([key, label]) => (
        <label key={key} style={{ display: 'block' }}>
          {label}: {weights[key].toFixed(1)}
          <input
            type="range"
            min={0}
            max={2}
            step={0.1}
            value={weights[key]}
            onChange={(e) =>
              setWeights({ [key]: parseFloat(e.target.value) } as any)
            }
          />
        </label>
      ))}
    </div>
  )
}
