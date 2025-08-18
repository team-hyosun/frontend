import { redirect } from 'react-router-dom'

import { fetchSubmitToday } from '@/hooks/queries/video'

export async function videoPreviewLoader() {
  const can = await fetchSubmitToday()
  if (!can) throw redirect('/video')
  return null
}
