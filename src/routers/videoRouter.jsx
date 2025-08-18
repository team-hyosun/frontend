import { lazy } from 'react'

import { videoPreviewLoader } from './loaders'

const VideoGuidePage = lazy(() => import('@/pages/Video/VideoGuide'))
const VideoPreviewPage = lazy(() => import('@/pages/Video/VideoPreview'))
const VideoResultPage = lazy(() => import('@/pages/Video/VideoResult'))

const videoRouter = [
  {
    path: '',
    element: <VideoGuidePage />,
  },
  {
    path: 'preview',
    element: <VideoPreviewPage />,

    loader: videoPreviewLoader,
  },
  {
    path: 'result/:id',
    element: <VideoResultPage />,
  },
]

export default videoRouter
