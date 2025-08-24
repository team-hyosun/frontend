import { Outlet, useRouteError } from 'react-router-dom'

import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { renderWithRouter } from './test-utils'

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

describe('Error Boundary', () => {
  it('레이아웃 유지 + 에러 바운더리로 본문 교체', async () => {
    const routes = [
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
    ]

    renderWithRouter(routes, ['/boom'])

    expect(await screen.findByText('HEADER')).toBeInTheDocument()
    expect(await screen.findByRole('alert')).toHaveTextContent('render-bomb')
  })
})
