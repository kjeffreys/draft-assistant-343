import { db, DraftPick } from '../db'

export interface DraftBackup {
  session: string
  picks: DraftPick[]
}

export async function exportDraft(session: string): Promise<DraftBackup> {
  const picks = await db.picks.where('session').equals(session).toArray()
  return { session, picks }
}

export async function importDraft(data: DraftBackup): Promise<void> {
  await db.picks.where('session').equals(data.session).delete()
  await db.picks.bulkAdd(
    data.picks.map((p) => ({ ...p, id: undefined, session: data.session }))
  )
}
