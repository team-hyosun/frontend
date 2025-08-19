import { Outlet, useLocation, useMatches, useNavigate } from 'react-router-dom'

import Header from '@/components/ui/Header'

export default function Layout() {
  const matches = useMatches()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const isHome = pathname === '/'
  let title = ''
  for (let i = matches.length - 1; i >= 0; i--) {
    const h = matches[i].handle
    if (h && h.title) {
      title = h.title
      break
    }
  }

  return (
    <div className="relative w-[486px] h-[823px] py-3 px-11 flex flex-col">
      <Header>
        <Header.Left>
          {isHome ? (
            <Header.Logo />
          ) : (
            <Header.Back
              onClick={() =>
                history.length > 1 ? navigate(-1) : navigate('/')
              }
            />
          )}
        </Header.Left>

        <Header.Center>
          {!isHome && <Header.Title>{title}</Header.Title>}
        </Header.Center>

        <Header.Right>
          <Header.Bell count={3} />
        </Header.Right>
      </Header>

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
