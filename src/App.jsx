import { RouterProvider } from 'react-router-dom'
import router from './routers/router'
import QueryProvider from './components/QueryProvider'

function App() {
  return (
    <>
      <QueryProvider>
        <RouterProvider router={router} />
      </QueryProvider>
    </>
  )
}

export default App
