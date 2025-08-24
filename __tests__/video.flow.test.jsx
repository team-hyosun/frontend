// test/video.flow.test.jsx - 실제 세션 스토리지 구조에 맞춘 테스트
import { screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { routesConfig } from '../src/routers/router'
import { MOCK_ID, testUtils } from '../vitest.setup'
import { renderWithRouter } from './test-utils'

// 실제 getSessionResult 함수와 동일한 로직
function fnv1a32(str) {
  let h = 0x811c9dc5
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24)
  }
  return (h >>> 0).toString(36)
}

function setValidSessionResult(id, data) {
  const json = JSON.stringify(data)
  const payload = {
    _ts: Date.now(),
    data,
    _chk: fnv1a32(json),
  }
  sessionStorage.setItem(`result-${id}`, JSON.stringify(payload))
}

function setExpiredSessionResult(id, data) {
  const json = JSON.stringify(data)
  const payload = {
    _ts: Date.now() - 1000 * 60 * 15, // 15분 전 (만료)
    data,
    _chk: fnv1a32(json),
  }
  sessionStorage.setItem(`result-${id}`, JSON.stringify(payload))
}

describe('VideoResult Page - 2단계 백업 시스템', () => {
  beforeEach(() => {
    testUtils.setupAuth()
    sessionStorage.clear()
  })

  describe('1단계: 임시 저장 (휘발성 데이터)', () => {
    it('세션 스토리지에서 AI 분석 결과를 즉시 복구한다', async () => {
      // 실제 구조에 맞는 세션 데이터 설정
      const analysisResult = {
        walkingRecordId: MOCK_ID,
        leftTiltAngle: 3.8,
        rightTiltAngle: 4.2,
        weeklyUpdrsScore: 2,
        timestamp: Date.now(),
      }

      setValidSessionResult(MOCK_ID, analysisResult)

      renderWithRouter(routesConfig, [`/video/result/${MOCK_ID}`])

      expect(await screen.findByTestId('좌측-angle')).toHaveTextContent('3.8')
      expect(await screen.findByTestId('우측-angle')).toHaveTextContent('4.2')
      expect(await screen.findByTestId('weekly-score')).toHaveTextContent('2')
    })

    it('세션 스토리지 데이터가 없으면 React Query 캐시를 확인한다', async () => {
      // 세션 스토리지는 비어있음
      const { queryClient } = renderWithRouter(routesConfig, [
        `/video/result/${MOCK_ID}`,
      ])

      // React Query 캐시에서 복구
      queryClient.setQueryData(['video', 'result', 'today', MOCK_ID], {
        walkingRecordId: MOCK_ID,
        leftTiltAngle: 2.5,
        rightTiltAngle: 3.1,
        weeklyUpdrsScore: 1,
      })

      expect(await screen.findByTestId('좌측-angle')).toHaveTextContent('2.5')
      expect(await screen.findByTestId('우측-angle')).toHaveTextContent('3.1')
      expect(await screen.findByTestId('weekly-score')).toHaveTextContent('1')
    })
  })

  describe('2단계: 백업 우선순위 시스템', () => {
    it('세션 스토리지가 React Query 캐시보다 우선순위가 높다', async () => {
      // 먼저 세션 스토리지에 데이터 설정 (렌더링 전)
      setValidSessionResult(MOCK_ID, {
        leftTiltAngle: 4.2,
        rightTiltAngle: 3.8,
        weeklyUpdrsScore: 3,
      })

      // 렌더링
      const { queryClient } = renderWithRouter(routesConfig, [
        `/video/result/${MOCK_ID}`,
      ])

      // React Query 캐시에 다른 데이터 설정 (렌더링 후)
      queryClient.setQueryData(['video', 'result', 'today', MOCK_ID], {
        leftTiltAngle: 1.0,
        rightTiltAngle: 1.5,
        weeklyUpdrsScore: 0,
      })

      // 세션 스토리지(1차) 데이터가 우선 적용되어야 함
      expect(await screen.findByTestId('좌측-angle')).toHaveTextContent('4.2')
      expect(await screen.findByTestId('우측-angle')).toHaveTextContent('3.8')
      expect(await screen.findByTestId('weekly-score')).toHaveTextContent('3')
    })

    it('모든 캐시가 없으면 안전한 기본값(0)을 표시한다', async () => {
      const { queryClient } = renderWithRouter(routesConfig, [
        `/video/result/${MOCK_ID}`,
      ])
      queryClient.clear()

      expect(await screen.findByTestId('좌측-angle')).toHaveTextContent('0')
      expect(await screen.findByTestId('우측-angle')).toHaveTextContent('0')
      expect(await screen.findByTestId('weekly-score')).toHaveTextContent('0')
    })
  })

  describe('엣지 케이스: 데이터 무결성', () => {
    it('만료된 세션 데이터는 무시하고 React Query 캐시로 fallback한다', async () => {
      // 만료된 세션 데이터 (15분 전)
      setExpiredSessionResult(MOCK_ID, {
        leftTiltAngle: 999,
        rightTiltAngle: 999,
        weeklyUpdrsScore: 999,
      })

      const { queryClient } = renderWithRouter(routesConfig, [
        `/video/result/${MOCK_ID}`,
      ])

      // React Query 캐시에 유효한 데이터
      queryClient.setQueryData(['video', 'result', 'today', MOCK_ID], {
        leftTiltAngle: 2.2,
        rightTiltAngle: 2.8,
        weeklyUpdrsScore: 1,
      })

      // 만료된 세션 데이터는 무시되고 캐시 데이터 사용
      expect(await screen.findByTestId('좌측-angle')).toHaveTextContent('2.2')
      expect(await screen.findByTestId('우측-angle')).toHaveTextContent('2.8')
      expect(await screen.findByTestId('weekly-score')).toHaveTextContent('1')
    })

    it('손상된 체크섬의 세션 데이터는 무시한다', async () => {
      // 체크섬이 잘못된 데이터 직접 설정
      const corruptedData = {
        _ts: Date.now(),
        data: {
          leftTiltAngle: 999,
          rightTiltAngle: 999,
          weeklyUpdrsScore: 999,
        },
        _chk: 'invalid-checksum',
      }
      sessionStorage.setItem(`result-${MOCK_ID}`, JSON.stringify(corruptedData))

      const { queryClient } = renderWithRouter(routesConfig, [
        `/video/result/${MOCK_ID}`,
      ])

      // React Query 캐시에 유효한 데이터
      queryClient.setQueryData(['video', 'result', 'today', MOCK_ID], {
        leftTiltAngle: 3.3,
        rightTiltAngle: 3.7,
        weeklyUpdrsScore: 2,
      })

      // 손상된 세션 데이터는 무시되고 캐시 데이터 사용
      expect(await screen.findByTestId('좌측-angle')).toHaveTextContent('3.3')
      expect(await screen.findByTestId('우측-angle')).toHaveTextContent('3.7')
      expect(await screen.findByTestId('weekly-score')).toHaveTextContent('2')
    })

    it('부분 데이터만 있어도 안전하게 처리한다', async () => {
      // 일부 필드만 있는 데이터
      setValidSessionResult(MOCK_ID, {
        walkingRecordId: MOCK_ID,
        leftTiltAngle: 5.5,
        // rightTiltAngle 누락
        // weeklyUpdrsScore 누락
      })

      renderWithRouter(routesConfig, [`/video/result/${MOCK_ID}`])

      // 있는 데이터는 표시, 없는 데이터는 기본값
      expect(await screen.findByTestId('좌측-angle')).toHaveTextContent('5.5')
      expect(await screen.findByTestId('우측-angle')).toHaveTextContent('0')
      expect(await screen.findByTestId('weekly-score')).toHaveTextContent('0')
    })
  })

  describe('사용자 시나리오: 파킨슨 환자의 영상 촬영 여정', () => {
    it('시나리오 1: 영상 촬영 → AI 분석 → 새로고침 → 데이터 유지', async () => {
      // AI 분석 결과를 두 곳에 모두 저장
      const analysisResult = {
        walkingRecordId: MOCK_ID,
        leftTiltAngle: 6.2,
        rightTiltAngle: 5.8,
        weeklyUpdrsScore: 4,
        analysisDate: '2025-08-23',
      }

      // 먼저 React Query 캐시에 저장
      const { queryClient, unmount } = renderWithRouter(routesConfig, [
        `/video/result/${MOCK_ID}`,
      ])
      queryClient.setQueryData(
        ['video', 'result', 'today', MOCK_ID],
        analysisResult
      )

      // 세션 스토리지에도 안전하게 백업
      setValidSessionResult(MOCK_ID, analysisResult)

      // 기존 렌더링 정리
      unmount()

      // 새로고침 시뮬레이션 (새로운 렌더링)
      renderWithRouter(routesConfig, [`/video/result/${MOCK_ID}`])

      // 데이터 유실 없이 결과 표시
      expect(await screen.findByTestId('좌측-angle')).toHaveTextContent('6.2')
      expect(await screen.findByTestId('우측-angle')).toHaveTextContent('5.8')
      expect(await screen.findByTestId('weekly-score')).toHaveTextContent('4')
    })
  })

  describe('TTL 및 보안: 10분 만료 정책', () => {
    it('10분이 지난 데이터는 자동으로 만료되어 기본값으로 fallback', async () => {
      // 11분 전 데이터 (만료)
      setExpiredSessionResult(MOCK_ID, {
        leftTiltAngle: 100,
        rightTiltAngle: 200,
        weeklyUpdrsScore: 300,
      })

      renderWithRouter(routesConfig, [`/video/result/${MOCK_ID}`])

      // 만료된 데이터는 사용되지 않고 기본값
      expect(await screen.findByTestId('좌측-angle')).toHaveTextContent('0')
      expect(await screen.findByTestId('우측-angle')).toHaveTextContent('0')
      expect(await screen.findByTestId('weekly-score')).toHaveTextContent('0')
    })
  })
})
