import { useEffect, useState } from 'react'
import * as tf from '@tensorflow/tfjs'
import { Player } from '../store'

export function useAvailabilityModel() {
  const [model, setModel] = useState<tf.GraphModel | null>(null)

  useEffect(() => {
    tf.loadGraphModel('/availability_model_tfjs/model.json')
      .then(setModel)
      .catch(() => setModel(null))
  }, [])

  return model
}

export function predictChance(model: tf.GraphModel | null, player: Player): number {
  if (!model) return 0
  const input = tf.tensor2d([[player.vor ?? 0, player.injured ? 1 : 0]])
  const out = model.predict(input) as tf.Tensor
  const prob = out.dataSync()[0] ?? 0
  tf.dispose([input, out])
  return prob
}
