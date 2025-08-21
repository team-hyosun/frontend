// 테스트 전용 msw 서버
import { HttpResponse, http } from 'msw'
import { setupServer } from 'msw/node'

/* -------------------------------------------------------------------------- */
/* ✅ 공용 유틸                                                                */
/* -------------------------------------------------------------------------- */
const ok = payload => HttpResponse.json(payload)
const fail = (message = 'mock error', status = 500) =>
  HttpResponse.json({ message }, { status })

export const MOCK_ID = 'mock-abc12345'

/* -------------------------------------------------------------------------- */
/* ✅ Video 핸들러                                                     */
/* -------------------------------------------------------------------------- */

// ✅ 성공 핸들러 (고정된 mock id와 데이터)
export const handlersSuccess = [
  http.get('/api/walking-record/eligibility', () => HttpResponse.json(true)),
  http.post('/api/walking-record', () =>
    ok({
      walkingRecordId: MOCK_ID,
      date: '2025-08-20',
      leftTiltAngle: 3.8,
      rightTiltAngle: 4.2,
      weeklyUpdrsScore: 2,
    })
  ),
  http.get('/api/result/:id', ({ params }) => {
    return ok({
      walkingRecordId: params.id,
      leftTiltAngle: 1.1,
      rightTiltAngle: 2.2,
      weeklyUpdrsScore: 3,
    })
  }),
]

// ❌ 서버 실패 핸들러
export const handlersServerFail = [
  http.get('/api/walking-record/eligibility', () => HttpResponse.json(true)),
  http.post('/api/walking-record', () => fail('업로드 실패', 500)),
  http.get('/api/result/:id', () => fail('서버 오류', 500)),
]

/* -------------------------------------------------------------------------- */
/* ✅ Auth 핸들러                                                              */
/* -------------------------------------------------------------------------- */
export const handlersAuth = [
  // 로그인 성공 (간단히 토큰 반환)
  http.post('/api/auth/login', async ({ request }) => {
    const body = await request.json()
    if (body.email === 'test@example.com' && body.password === '1234') {
      return ok({ accessToken: 'mock-access', refreshToken: 'mock-refresh' })
    }
    return fail('Invalid credentials', 401)
  }),

  // 로그아웃
  http.post('/api/auth/logout', () => ok({ success: true })),

  // 현재 사용자 조회
  http.get('/api/auth/me', () =>
    ok({
      id: 'user-1',
      name: 'Mock User',
      email: 'test@example.com',
    })
  ),
]

/* -------------------------------------------------------------------------- */
/* 🚀 MSW 서버                                                                 */
/* -------------------------------------------------------------------------- */
export const server = setupServer(
  ...handlersAuth, // ✅ Auth 기본 세팅
  ...handlersSuccess // ✅ Video 기본 성공 세팅
)
