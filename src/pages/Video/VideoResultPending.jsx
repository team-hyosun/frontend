import { useEffect } from 'react'
import { FaChartLine } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

import { useUploadWalkingVideo } from '@/hooks/queries/video'

import ResultSectionSkeleton from './ResultSection.Loading'

export default function VideoResultPending() {
  const navigate = useNavigate()
  const { start } = useUploadWalkingVideo()
  useEffect(() => {
    start()
    // 해당 훅 안에 navigate 포함
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      data-testid="pending-skeleton"
      aria-busy="true"
      className="py-6 w-full"
    >
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          영상 처리 결과
        </h1>
        <p className="mt-1 text-sm text-white/70">
          AI 영상 처리 분석 결과를 확인하세요.
        </p>
      </header>

      <main>
        <ResultSectionSkeleton />

        <WeeklyChartExplanation onGoWeekly={() => navigate('/report')} />
      </main>

      <footer className="text-center">
        <button
          className="action-button-base action-button-secondary px-12"
          onClick={() => navigate('/')}
        >
          홈으로 돌아가기
        </button>
      </footer>
    </div>
  )
}

function WeeklyChartExplanation({ onGoWeekly }) {
  return (
    <section
      aria-labelledby="weekly-chart-title"
      className="rounded-3xl p-5 bg-gradient-to-br from-black-800 to-black-700 border border-white/10 mb-6"
    >
      <header className="flex items-center gap-3 mb-3">
        <div
          className="size-10 grid place-items-center rounded-2xl bg-gradient-to-br from-primary-500/20 to-primary-300/20 border border-primary-400/30"
          aria-hidden="true"
        >
          <FaChartLine className="w-5 h-5 text-primary-300" />
        </div>
        <h3
          id="weekly-chart-title"
          className="text-lg font-semibold text-white"
        >
          주간차트란?
        </h3>
      </header>

      <p className="text-sm text-white/80 mb-4">
        환자 분의 일주일 기록을 분석해
        <br />
        차트로 진행 추이를 나타낸 것입니다.
      </p>

      <div className="flex items-center justify-between">
        <p className="text-sm text-white/80">
          주간차트를 열람하고 싶으시면,{' '}
          <button
            onClick={onGoWeekly}
            className="underline text-primary-200"
            aria-label="주간차트 보기"
          >
            클릭
          </button>
          <span> 해주세요.</span>
        </p>
      </div>
    </section>
  )
}
