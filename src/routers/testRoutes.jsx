import { lazy } from 'react'

const ENABLE = import.meta.env.VITE_ENABLE_TEST_ROUTES === 'true'

// prod 번들 최소화
const testRoutes = ENABLE
  ? (() => {
      const BoomRenderPage = lazy(() => import('@/pages/BoomRender'))
      async function boomLoader404() {
        throw new Response('Not Found', { status: 404 })
      }
      async function boomLoader500() {
        throw new Error('loader-bomb')
      }

      return [
        { path: 'boom-render', element: <BoomRenderPage /> },
        { path: 'boom-404', loader: boomLoader404, element: <div /> },
        { path: 'boom-500', loader: boomLoader500, element: <div /> },
      ]
    })()
  : []

export default testRoutes
