import { Suspense, lazy } from 'react'
import { Outlet } from 'react-router-dom'

import Layout from '@/components/Layout'
import Spinner from '@/components/Spinner'
import { TITLES as T } from '@/constant/routeMeta'

import authRouter from './authRouter'
import { guardLoader, rootLoader } from './loaders'
import testRoutes from './testRoutes'
import videoRouter from './videoRouter'

export const loading = <Spinner size={28} className="min-h-screen" />

const HomePage = lazy(() => import('@/pages/Home'))
const MedicationPage = lazy(() => import('@/pages/Medication'))
const ReportPage = lazy(() => import('@/pages/Report'))
const HistoryPage = lazy(() => import('@/pages/History'))
const NotFoundPage = lazy(() => import('@/pages/NotFound'))
const ErrorBoundaryPage = lazy(() => import('@/pages/ErrorBoundary'))

function Root() {
  return (
    <Suspense fallback={loading}>
      <Layout>
        <Outlet />
      </Layout>
    </Suspense>
  )
}

const ErrorBoundaryElement = (
  <Suspense fallback={loading}>
    <ErrorBoundaryPage />
  </Suspense>
)

export const routesConfig = [
  {
    path: '/',
    element: <Root />,
    loader: rootLoader, // remember=1이면 부팅 시 1회 refresh (리다이렉트 없음)
    children: [
      {
        element: <Outlet />,
        errorElement: ErrorBoundaryElement,
        children: [
          { path: 'auth', children: authRouter }, // public

          {
            element: <Outlet />,
            loader: guardLoader, // 보호 라우트 가드
            children: [
              { index: true, element: <HomePage /> },

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
            ],
          },

          // 404
          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
  },
]
