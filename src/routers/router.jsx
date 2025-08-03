import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import authRouter from './authRouter'
import videoRouter from './videoRouter'

const loading = <div>loading</div>

const HomePage = lazy(() => import('@/pages/Home'))
const MedicationPage = lazy(() => import('@/pages/Medication'))
const ReportPage = lazy(() => import('@/pages/Report'))
const HistoryPage = lazy(() => import('@/pages/History'))

const NotFoundPage = lazy(() => import('@/pages/NotFound'))

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={loading}>
        <HomePage />
      </Suspense>
    ),
  },
  {
    path: '/auth',
    children: authRouter,
  },
  {
    path: '/video',
    children: videoRouter,
  },
  {
    path: '/medication',
    element: (
      <Suspense fallback={loading}>
        <MedicationPage />
      </Suspense>
    ),
  },
  {
    path: '/report',
    element: (
      <Suspense fallback={loading}>
        <ReportPage />
      </Suspense>
    ),
  },
  {
    path: '/history',
    element: (
      <Suspense fallback={loading}>
        <HistoryPage />
      </Suspense>
    ),
  },
  {
    path: '*',
    element: (
      <Suspense fallback={loading}>
        <NotFoundPage />
      </Suspense>
    ),
  },
])

export default router
