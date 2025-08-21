import { render, waitFor } from '@testing-library/react'
import { HttpResponse, http } from 'msw'
import { beforeAll } from 'vitest'
import { afterEach } from 'vitest'
import { afterAll } from 'vitest'
import { test } from 'vitest'
import { expect } from 'vitest'

import { routesConfig } from '../src/routers/router'
import { server } from './msw.server'
// 실제 라우트
import { renderWithRouter } from './renderWithRouter.jsx'

beforeAll(() => server.listen())
afterEach(() => {
  server.resetHandlers()
  localStorage.clear()
  sessionStorage.clear()
})
afterAll(() => server.close())

test('T01: remember=false → 보호 라우트(/) 진입 시 /auth/login 으로 리다이렉트', async () => {
  // reissue가 호출되면 안 되므로, 호출 시 500으로 눈에 띄게 실패하게 해도 됨
  let reissueCalls = 0
  server.use(
    http.post('*/api/auth/reissue', () => {
      reissueCalls += 1
      return HttpResponse.json({ msg: 'should-not-be-called' }, { status: 500 })
    })
  )

  localStorage.setItem('remember', '0') // 로그인 유지 OFF
  const { router, ui } = renderWithRouter(routesConfig, ['/'])
  render(ui)

  await waitFor(() => {
    expect(router.state.location.pathname).toBe('/auth/login')
  })
  expect(reissueCalls).toBe(0)
})
