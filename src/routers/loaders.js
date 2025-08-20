import { redirect } from 'react-router-dom'

import { useVideoStore } from '@/stores/videoStore'

export async function videoPreviewLoader() {
  const { file } = useVideoStore.getState()
  if (!file) throw redirect('/video')
  return null
}
