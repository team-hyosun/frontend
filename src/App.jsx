import { RouterProvider } from 'react-router-dom'

import QueryProvider from './components/QueryProvider'
import router, { loading } from './routers/router'

function App() {
  return (
    <>
      <QueryProvider>
        <RouterProvider router={router} fallbackElement={loading} />
      </QueryProvider>
    </>
  )
}

export default App
