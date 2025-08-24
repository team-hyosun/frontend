import { FaChartLine, FaWalking } from 'react-icons/fa'
import { useNavigate, useParams } from 'react-router-dom'

import { useQueryClient } from '@tanstack/react-query'

import { QUERY_KEY_TODAY_RESULT } from '@/constant/queryKeys'
import { getSessionResult } from '@/libs/sessionStore'
import { analyzeAngles } from '@/utils/angleClassifier'

export default function VideoResult() {
  const { id } = useParams()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  // 세션 캐시 1차
  const sessionData = getSessionResult(id)
  // 2) React Query 캐시 2차 복구 (네트워크 미사용, 메모리 캐시 접근)
  const rqCached =
    queryClient.getQueryData([...QUERY_KEY_TODAY_RESULT, String(id)]) ?? null

  // 우선순위: 세션 → RQ 캐시
  const result = sessionData?.data ?? rqCached ?? null

  // 가드
  const {
    leftTiltAngle = 0,
    rightTiltAngle = 0,
    weeklyUpdrsScore = 0,
  } = result ?? {}

  const angles = analyzeAngles(leftTiltAngle, rightTiltAngle)

  return (
    <div className="py-6 w-full">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          영상 처리 결과
        </h1>
        <p className="mt-1 text-sm text-white/70">
          AI 영상 처리 분석 결과를 확인하세요.
        </p>
      </header>

      <main data-testid="result-page">
        <ResultSection angles={angles} weeklyUpdrsScore={weeklyUpdrsScore} />

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

function ResultSection({ angles, weeklyUpdrsScore }) {
  return (
    <section
      aria-labelledby="weekly-result-title"
      className="rounded-3xl pb-5 pt-2 px-6 mb-6 bg-gradient-to-br from-black-700 to-primary-800 border border-black-500 relative overflow-hidden"
    >
      <FaWalking
        className="pointer-events-none absolute -right-3 top-4 text-9xl text-white/5"
        aria-hidden="true"
      />

      <div className="flex flex-col items-center text-center gap-2 relative z-10">
        <WalkingAngleSection angles={angles} />

        <header className="mb-3">
          <h2 id="weekly-result-title" className="text-xl font-bold text-white">
            이번 주는{' '}
            <span
              data-testid="weekly-score"
              className="bg-gradient-to-r from-primary-300 to-primary-100 bg-clip-text text-transparent"
            >
              {weeklyUpdrsScore} 구간
            </span>{' '}
            입니다.
          </h2>
          <p className="mt-2 text-xs text-white/50 max-w-md">
            * 구간은 최근 회원님이 가장 많이 머물렀던 점수 지표를 의미합니다.
          </p>

          <p className="mt-3 text-sm text-white/80 max-w-md">
            <span className="text-4xl text-primary-200/30 font-bold">"</span>
            <span className="text-base font-medium text-white mx-2">
              아주 잘하고 계세요
            </span>
            <span className="text-4xl text-primary-200/30 font-bold">"</span>
          </p>
        </header>
        <AnalysisSummary angles={angles} />
      </div>
    </section>
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

function AngleTile({ side, angle }) {
  return (
    <div
      className={`rounded-xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-3`}
    >
      <div className="text-start text-xs text-white/60 mb-1">{side}</div>
      <div className="flex items-baseline gap-1">
        <span
          data-testid={`${side}-angle`}
          className="text-3xl font-extrabold leading-none text-white tabular-nums"
        >
          {angle.angle}
        </span>
        <span className="text-sm text-white/70">°</span>
      </div>
      <div className={`mt-2 h-1.5 rounded-full ${angle.barColor}`} />
    </div>
  )
}

function WalkingAngleSection({ angles }) {
  return (
    <section
      aria-labelledby="walking-angle-title"
      className="relative mb-6 w-full"
    >
      <div className="flex items-center gap-2 p-4">
        <h3
          id="walking-angle-title"
          className="flex-1 text-lg font-medium text-white"
        >
          보행 각도
        </h3>
      </div>

      <div className="relative">
        <div
          className="pointer-events-none absolute left-1/2 top-3 bottom-3 -translate-x-1/2 w-px bg-gradient-to-b from-primary-400/40 to-primary-400/10"
          aria-hidden="true"
        />

        <div className="grid grid-cols-2 gap-3">
          <AngleTile side="좌측" angle={angles.left} />
          <AngleTile side="우측" angle={angles.right} />
        </div>
      </div>
    </section>
  )
}

function AnalysisSummary({ angles }) {
  const summaryItems = [
    {
      label: '좌측 상태',
      status: `${angles.left.label}`,
      textColor: `${angles.left.textColor}`,
    },
    {
      label: '우측 상태',
      status: `${angles.right.label}`,
      textColor: `${angles.right.textColor}`,
    },
  ]

  return (
    <div className="p-5 rounded-2xl bg-gradient-to-br from-black-800/80 to-black-700/80 border border-white/10 backdrop-blur w-full max-w-sm">
      <h3 className="text-sm font-semibold text-white mb-4 text-center">
        보행 분석 요약
      </h3>

      <dl className="space-y-3">
        {summaryItems.map((item, index) => (
          <div key={index} className="flex justify-between items-center">
            <dt className="text-xs text-white/60">{item.label}</dt>
            <dd className={`text-sm font-medium ${item.textColor}`}>
              {item.status}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
