// src/pages/test/ResultLoading.Test.jsx
import { useCallback, useEffect, useState } from 'react'

import ResultSectionLoading from '../Video/ResultSection.Loading'

const FAKE_API_SECONDS = 15 // 실제 응답까지 걸리는 시간 가정(초)
/** 10초 뒤에 데이터가 오는 가짜 API */
function fakeApiCall() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        walkingRecordId: 123,
        leftTiltAngle: 3.7,
        rightTiltAngle: 4.1,
        weeklyUpdrsScore: 1,
      })
    }, FAKE_API_SECONDS * 1000)
  })
}

export default function ResultLoadingTestPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  const run = useCallback(() => {
    setData(null)
    setLoading(true)
    fakeApiCall().then(res => {
      setData(res)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    run()
  }, [run])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-white mb-4">
        ResultSection Loading 테스트
      </h1>

      {loading ? (
        <ResultSectionLoading
        // height는 내부 고정 467px, 안내 문구/지연시간 기본값 사용
        // spinnerDelayMs={400}
        // longNoticeMs={5000}
        // longNoticeText="데이터 분석 중입니다… 조금만 기다려 주세요."
        />
      ) : (
        <section className="rounded-3xl p-6 mb-6 bg-black-700 border border-white/10 text-white">
          <h2 className="text-xl font-bold mb-2">API 응답 도착</h2>
          <p className="text-sm text-white/70 mb-4">
            10초 후 더미 데이터를 수신했습니다.
          </p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="text-white/60">walkingRecordId</div>
              <div className="font-semibold">{data.walkingRecordId}</div>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="text-white/60">weeklyUpdrsScore</div>
              <div className="font-semibold">{data.weeklyUpdrsScore}</div>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="text-white/60">leftTiltAngle</div>
              <div className="font-semibold">{data.leftTiltAngle}°</div>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="text-white/60">rightTiltAngle</div>
              <div className="font-semibold">{data.rightTiltAngle}°</div>
            </div>
          </div>
        </section>
      )}

      <div className="mt-4 flex gap-3">
        <button
          type="button"
          onClick={run}
          className="action-button-base action-button-secondary"
        >
          다시 테스트 (10초 로딩)
        </button>
      </div>
    </div>
  )
}
