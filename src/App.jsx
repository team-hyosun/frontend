import { Toaster } from 'react-hot-toast'
import { RouterProvider } from 'react-router-dom'

import QueryProvider from './components/QueryProvider'
import router, { loading } from './routers/router'

function App() {
  return (
    <>
      <QueryProvider>
        <Toaster position="top-center" reverseOrder={false} />
        <RouterProvider router={router} fallbackElement={loading} />
      </QueryProvider>
    </>
  )
}

export default App
