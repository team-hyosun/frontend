// vitest.setup.js
import '@testing-library/jest-dom'
import { afterAll, afterEach, beforeAll, vi } from 'vitest'

import { server } from './__tests__/msw.server'

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => {
  server.resetHandlers()
  sessionStorage.clear()
})
afterAll(() => server.close())

// 💡 fetch/AbortController를 Vitest 환경에서 완전히 Mocking합니다.
// 이렇게 하면 undici와 jsdom 간의 호환성 문제를 근본적으로 해결할 수 있습니다.
vi.mock('node:internal/deps/undici/undici', async importOriginal => {
  const mod = await importOriginal()
  return {
    ...mod,
    fetch: vi.fn(mod.fetch),
    AbortController: vi.fn(() => ({
      abort: vi.fn(),
      signal: {
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        aborted: false,
      },
    })),
  }
})

// ✅ React Query Devtools가 테스트에서 로드되지 않도록 무력화(선택)
vi.mock('@tanstack/react-query-devtools', () => ({
  ReactQueryDevtools: () => null,
}))
