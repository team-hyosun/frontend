// 메모리 라우터 + React Query Provider
import { RouterProvider, createMemoryRouter } from 'react-router-dom'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export function renderWithRouter(routes, initial = ['/']) {
  const router = createMemoryRouter(routes, { initialEntries: initial })
  const qc = new QueryClient({ defaultOptions: { queries: { retry: 0 } } })
  const ui = (
    <QueryClientProvider client={qc}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
  return { router, ui }
}
