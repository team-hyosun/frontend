import { lazy, Suspense } from 'react'
import { createBrowserRouter, Outlet } from 'react-router-dom'
import authRouter from './authRouter'
import videoRouter from './videoRouter'
import Layout from '../components/Layout'
import { TITLES as T } from '@/constant/routeMeta'

const loading = <div>loading</div>

const HomePage = lazy(() => import('@/pages/Home'))
const MedicationPage = lazy(() => import('@/pages/Medication'))
const ReportPage = lazy(() => import('@/pages/Report'))
const HistoryPage = lazy(() => import('@/pages/History'))
const NotFoundPage = lazy(() => import('@/pages/NotFound'))

function Root() {
  return (
    <Suspense fallback={loading}>
      <Layout>
        <Outlet />
      </Layout>
    </Suspense>
  )
}
const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'auth', children: authRouter },
      { path: 'video', children: videoRouter, handle: { title: T['/video'] } },
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
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])

export default router
