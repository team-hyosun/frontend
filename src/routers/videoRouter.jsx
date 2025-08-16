import { lazy } from 'react'
import { Guard } from '../components/Guard'
import { useVideoStore } from '../stores/videoStore'

const VideoGuidePage = lazy(() => import('@/pages/Video/VideoGuide'))
const VideoPreviewPage = lazy(() => import('@/pages/Video/VideoPreview'))
const VideoResultPage = lazy(() => import('@/pages/Video/VideoResult'))

const VideoPreviewGuard = () => {
  const { getTodayVideoMeta } = useVideoStore()

  return (
    <Guard condition={!!getTodayVideoMeta()} redirectTo="/video">
      <VideoPreviewPage />
    </Guard>
  )
}

const videoRouter = [
  {
    path: '',
    element: <VideoGuidePage />,
  },
  {
    path: 'preview',
    element: (
      <VideoPreviewGuard>
        <VideoPreviewPage />,
      </VideoPreviewGuard>
    ),
  },
  {
    path: 'result/:id',
    element: <VideoResultPage />,
  },
]

export default videoRouter
