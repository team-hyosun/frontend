import { HttpResponse } from 'msw'

export const ok = (payload, init) =>
  HttpResponse.json({ isSuccess: true, payload }, init)

export const fail = (message = 'mock error', status = 400, extra = {}) =>
  HttpResponse.json({ isSuccess: false, message, ...extra }, { status })

export const networkFail = () => HttpResponse.error() // 네트워크 에러 시뮬
