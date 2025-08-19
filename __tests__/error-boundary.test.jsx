import {
  Outlet,
  RouterProvider,
  createMemoryRouter,
  useRouteError,
} from 'react-router-dom'

import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { expect } from 'vitest'
import { it } from 'vitest'

function Layout() {
  return (
    <div>
      <header>HEADER</header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}
function Boundary() {
  return <Outlet />
}
function Boom() {
  throw new Error('render-bomb')
}
function ErrorPage() {
  const e = useRouteError()
  return <div role="alert">{e?.message}</div>
}

it('레이아웃 유지 + 에러 바운더리로 본문 교체', async () => {
  const router = createMemoryRouter(
    [
      {
        path: '/',
        element: <Layout />,
        children: [
          {
            element: <Boundary />,
            errorElement: <ErrorPage />,
            children: [{ path: '/boom', element: <Boom /> }],
          },
        ],
      },
    ],
    { initialEntries: ['/boom'] }
  )

  render(<RouterProvider router={router} />)

  expect(await screen.findByText('HEADER')).toBeInTheDocument()
  expect(await screen.findByRole('alert')).toHaveTextContent('render-bomb')
})
