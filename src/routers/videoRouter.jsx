import { lazy, Suspense } from 'react'

const loading = <div>loading...</div>
const VideoPage = lazy(() => import('@/pages/Video'))
const videoRouter = [
  {
    path: '',
    element: (
      <Suspense fallback={loading}>
        <VideoPage />
      </Suspense>
    ),
  },
]

export default videoRouter
