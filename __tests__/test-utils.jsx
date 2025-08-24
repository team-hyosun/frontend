import { RouterProvider, createMemoryRouter } from 'react-router-dom'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'

export function renderWithRouter(routes, initial = ['/']) {
  const router = createMemoryRouter(routes, { initialEntries: initial })
  const qc = new QueryClient({ defaultOptions: { queries: { retry: 0 } } })

  const renderResult = render(
    <QueryClientProvider client={qc}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )

  return { router, queryClient: qc, ...renderResult }
}
