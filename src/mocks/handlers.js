// src/mocks/handlers.js
import { HttpResponse, delay, http } from 'msw'

const ok = payload => HttpResponse.json({ isSuccess: true, payload })
const genId = () => 'mock-' + Math.random().toString(36).slice(2, 10)

export const handlers = [
  // 1) 오늘 제출 가능 여부 (그대로 true만 내려줌)
  http.get('/api/walking-record/eligibility', async () => {
    await delay(150)
    return ok(true)
  }),

  // 2) 업로드 (실제 API와 동일하게 ?date= 사용; 유효성 검사 없음)
  http.post('/api/walking-record', async ({ request }) => {
    await delay(1000)

    // 실제 API가 요구하는 방식: 쿼리에서 date 읽음
    const url = new URL(request.url)
    const date =
      url.searchParams.get('date') || new Date().toISOString().slice(0, 10)

    // 바로 성공 응답 (검증/폼 파싱 없이)
    return ok({
      walkingRecordId: genId(),
      date,
      leftTiltAngle: 3.8,
      rightTiltAngle: 4.2,
      weeklyUpdrsScore: 2,
    })
  }),
]
