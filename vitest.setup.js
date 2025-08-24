import '@testing-library/jest-dom'
import { HttpResponse, http } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, vi } from 'vitest'

// ========================== jsdom 설정 ==========================
const w = window
globalThis.fetch = w.fetch.bind(w)
globalThis.Headers = w.Headers
globalThis.Response = w.Response
globalThis.AbortController = w.AbortController
globalThis.AbortSignal = w.AbortSignal

class RequestNoSignal extends w.Request {
  constructor(input, init = {}) {
    if (init && 'signal' in init) {
      const { signal, ...rest } = init
      init = rest
    }
    super(input, init)
  }
}
globalThis.Request = RequestNoSignal

// ========================== MSW 설정 ==========================
const ok = payload => HttpResponse.json(payload)
const fail = (message = 'mock error', status = 500) =>
  HttpResponse.json({ message }, { status })

export const MOCK_ID = 'mock-abc12345'

const handlers = [
  // Auth
  http.post('*/api/auth/login', async ({ request }) => {
    const body = await request.json()
    if (body.email === 'test@example.com' && body.password === '1234') {
      return ok({ accessToken: 'mock-access', refreshToken: 'mock-refresh' })
    }
    return fail('Invalid credentials', 401)
  }),
  http.post('*/api/auth/logout', () => ok({ success: true })),
  http.post('*/api/auth/reissue', () =>
    ok({ payload: { accessToken: 'refreshed' } })
  ),
  http.get('*/api/auth/me', () => ok({ id: 'user-1', name: 'Mock User' })),

  // Walking record
  http.get('*/api/walking-record/eligibility', () => HttpResponse.json(true)),
  http.post('*/api/walking-record', () =>
    ok({
      walkingRecordId: MOCK_ID,
      date: '2025-08-20',
      leftTiltAngle: 3.8,
      rightTiltAngle: 4.2,
      weeklyUpdrsScore: 2,
    })
  ),

  // 기본 404 (테스트에서 오버라이드)
  http.get('*/api/walking-record/:id', () => fail('not found', 404)),
  http.get('*/api/result/:id', () => fail('not found', 404)),
]

export const server = setupServer(...handlers)

// ========================== 전역 설정 ==========================
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => {
  server.resetHandlers()
  localStorage.clear()
  sessionStorage.clear()
})
afterAll(() => server.close())

vi.mock('@tanstack/react-query-devtools', () => ({
  ReactQueryDevtools: () => null,
}))

// ========================== 테스트 헬퍼만 export ==========================
export const testUtils = {
  setupAuth: () => {
    localStorage.setItem('remember', '1')
    sessionStorage.setItem('AT', 'test.at')
  },

  mockSuccess: (id, data) => {
    server.use(
      http.get(`*/api/walking-record/${id}`, () =>
        HttpResponse.json({ isSuccess: true, payload: data, data })
      ),
      http.get(`*/api/result/${id}`, () =>
        HttpResponse.json({ isSuccess: true, payload: data, data })
      )
    )
  },
}
