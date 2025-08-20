import { Suspense, lazy } from 'react'
import { Outlet, createBrowserRouter } from 'react-router-dom'

import Spinner from '@/components/Spinner'
import { TITLES as T } from '@/constant/routeMeta'

import Layout from '../components/Layout'
import authRouter from './authRouter'
import testRoutes from './testRoutes'
import videoRouter from './videoRouter'

export const loading = <Spinner size={28} className="min-h-screen" />

const HomePage = lazy(() => import('@/pages/Home'))
const MedicationPage = lazy(() => import('@/pages/Medication'))
const ReportPage = lazy(() => import('@/pages/Report'))
const HistoryPage = lazy(() => import('@/pages/History'))
const NotFoundPage = lazy(() => import('@/pages/NotFound'))
const ErrorBoundaryPage = lazy(() => import('@/pages/ErrorBoundary'))

function BoundaryOutlet() {
  return <Outlet />
}
function Root() {
  return (
    <Suspense fallback={loading}>
      <Layout>
        <Outlet />
      </Layout>
    </Suspense>
  )
}
export const routesConfig = [
  {
    path: '/',
    element: <Root />,
    children: [
      {
        element: <BoundaryOutlet />,
        errorElement: <ErrorBoundaryPage />,
        children: [
          { index: true, element: <HomePage /> },
          { path: 'auth', children: authRouter },
          {
            path: 'video',
            children: videoRouter,
            handle: { title: T['/video'] },
          },
          {
            path: 'medication',
            element: <MedicationPage />,
            handle: { title: T['/medication'] },
          },
          {
            path: 'report',
            element: <ReportPage />,
            handle: { title: T['/report'] },
          },
          {
            path: 'history',
            element: <HistoryPage />,
            handle: { title: T['/history'] },
          },
          ...testRoutes,
          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
  },
]

// 앱에서 쓰는 건 기존처럼 router
const router = createBrowserRouter(routesConfig)
export default router
