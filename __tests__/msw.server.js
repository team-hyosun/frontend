import { HttpResponse, http } from 'msw'
import { setupServer } from 'msw/node'

const ok = p => HttpResponse.json(p)
const fail = (m = 'mock error', status = 500) =>
  HttpResponse.json({ message: m }, { status })

const MOCK_ID = 'mock-abc12345'

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

// MSW 서버
export const server = setupServer(...handlersSuccess)

// id를 공유하려면 여기서 export
export { MOCK_ID }
