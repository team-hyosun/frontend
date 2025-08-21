import { RouterProvider, createMemoryRouter } from 'react-router-dom'

import { render, screen } from '@testing-library/react'
import { HttpResponse, http } from 'msw'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { beforeEach } from 'vitest'

import { routesConfig } from '../src/routers/router'
import { handlersServerFail, server } from './msw.server'

// 공통 mock id
const MOCK_ID = 'mock-abc12345'
// msw 서버 라이프사이클
beforeEach(() => {
  // 가드 통과 조건 세팅
  localStorage.setItem('remember', '1') // remember ON
  sessionStorage.setItem('AT', 'test.at') // AT 주입 (가드가 바로 통과)
  // 혹시 첫 API에서 401 → 인터셉터가 /auth/reissue 부를 수 있으니 성공 핸들러도 보강
  server.use(
    http.post('*/api/auth/reissue', () =>
      HttpResponse.json({ payload: { accessToken: 'test.at.refreshed' } })
    )
  )
})
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
function renderWithRouter(initialEntries, routes) {
  const router = createMemoryRouter(routes, { initialEntries })
  return render(<RouterProvider router={router} />)
}
describe('VideoResult Page', () => {
  it('1) 캐시 있으면 캐시 데이터를 렌더링한다', async () => {
    sessionStorage.setItem(
      `result-${MOCK_ID}`,
      JSON.stringify({
        data: {
          walkingRecordId: MOCK_ID,
          leftTiltAngle: 3.8,
          rightTiltAngle: 4.2,
          weeklyUpdrsScore: 2,
        },
        _ts: Date.now(),
      })
    )

    renderWithRouter([`/video/result/${MOCK_ID}`], routesConfig)

    expect(await screen.findByTestId('좌측-angle')).toHaveTextContent('3.8')
    expect(await screen.findByTestId('우측-angle')).toHaveTextContent('4.2')
    expect(await screen.findByTestId('weekly-score')).toHaveTextContent('2')
  })

  it('2) 캐시 없으면 에러로 간다', async () => {
    sessionStorage.clear()
    renderWithRouter([`/video/result/${MOCK_ID}`], routesConfig)

    expect(await screen.findByTestId('error-message')).toHaveTextContent(
      '문제가 발생했어요'
    )
  })

  it('3) 결과 페이지 캐시 없으면 → ErrorBoundary', async () => {
    sessionStorage.clear()
    server.use(...handlersServerFail)

    const router = createMemoryRouter(routesConfig, {
      initialEntries: ['/video/result/nonexistent-id'],
    })

    render(<RouterProvider router={router} />)

    expect(await screen.findByTestId('error-message')).toHaveTextContent(
      '문제가 발생했어요'
    )
  })
  // it('5) 세션스토리지 없고 IndexedDB 복구 데이터 있으면 정상 렌더링', async () => {
  //   // 1. 세션스토리지 clear
  //   sessionStorage.clear()

  //   // 2. IndexedDB에 복구 데이터 저장
  //   const mockFile = new File(['dummy'], 'mock.mp4', { type: 'video/mp4' })
  //   await saveVideoTemp(mockFile)

  //   // 3. 라우터 구성 (result/:id 경로 진입)
  //   const router = createMemoryRouter(routesConfig, {
  //     initialEntries: ['/video/result/recover-id'],
  //   })

  //   render(<RouterProvider router={router} />)

  //   // 4. 복구된 데이터로 정상 렌더링 확인
  //   await waitFor(() => {
  //     expect(screen.getByTestId('좌측-angle')).toHaveTextContent('3.5')
  //     expect(screen.getByTestId('우측-angle')).toHaveTextContent('3.5')
  //     expect(screen.getByTestId('weekly-score')).toHaveTextContent('1')
  //   })
  // })
})
