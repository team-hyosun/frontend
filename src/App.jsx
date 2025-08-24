import { Toaster } from 'react-hot-toast'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import QueryProvider from '@/components/QueryProvider'
import { loading, routesConfig } from '@/routers/router'

const router = createBrowserRouter(routesConfig)

export default function App() {
  return (
    <QueryProvider>
      <Toaster position="top-center" reverseOrder={false} />
      <RouterProvider router={router} fallbackElement={loading} />
    </QueryProvider>
  )
}
