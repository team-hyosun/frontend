// components/result/ResultSection.Loading.jsx
import { useRef } from 'react'
import { useEffect, useState } from 'react'
import { FaWalking } from 'react-icons/fa'

// ===== 상수 (여기만 바꾸면 됨) =====
const HEIGHT_PX = 467 // 섹션 고정 높이
const STEP_GAP_SECONDS = 1.5 // 단계 간 간격 (1→2→3→0)
const CLEAR_PAUSE_SECONDS = 0.8 // 모두 사라진(0) 상태 유지 시간
const NOTICE_TEXT = '데이터 분석 중입니다… 조금만 기다려 주세요.'
// ===================================

const STEP_GAP_MS = STEP_GAP_SECONDS * 1000
const CLEAR_PAUSE_MS = CLEAR_PAUSE_SECONDS * 1000

// 순서: 1(angles) → 2(header 추가) → 3(summary 추가) → 0(모두 숨김) → 반복
const SEQUENCE = [0, 1, 2, 3, 0]

function useLoopingSkeleton() {
  const [step, setStep] = useState(SEQUENCE[0]) // 처음은 1
  const idxRef = useRef(0) // 현재 인덱스 (mutableref)
  const timerRef = useRef(null)

  useEffect(() => {
    // 다음 스텝을 예약하는 재귀 스케줄러
    const scheduleNext = delay => {
      timerRef.current = setTimeout(() => {
        const nextIdx = (idxRef.current + 1) % SEQUENCE.length
        idxRef.current = nextIdx
        const nextStep = SEQUENCE[nextIdx]
        setStep(nextStep)

        const nextDelay = nextStep === 0 ? CLEAR_PAUSE_MS : STEP_GAP_MS
        scheduleNext(nextDelay)
      }, delay)
    }

    // 첫 예약: 1에서 시작 -> STEP_GAP 후 2로
    scheduleNext(STEP_GAP_MS)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  return step // 0 | 1 | 2 | 3
}

function cx(...c) {
  return c.filter(Boolean).join(' ')
}

function AngleTileSkeleton({ visible }) {
  return (
    <div
      className={cx(
        'rounded-xl border border-white/10 bg-white/[0.06] p-3 h-24',
        'transition-all duration-800 ease-out',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
      )}
    >
      <div className="h-14 w-20 rounded bg-white/15" />
      <div className="mt-2 h-1.5 rounded-full bg-white/10" />
    </div>
  )
}

function ResultSectionSkeleton({ step }) {
  const anglesVisible = step >= 1
  const headerVisible = step >= 2
  const summaryVisible = step >= 3

  return (
    <section
      aria-label="주간 결과 로딩 중"
      className="rounded-3xl pb-5 pt-2 px-6 mb-6 
                 bg-gradient-to-br from-black-700 to-primary-800 
                 border border-black-500 relative overflow-hidden"
      style={{ height: HEIGHT_PX }}
    >
      <FaWalking
        className="pointer-events-none absolute -right-3 top-4 text-9xl text-white/5"
        aria-hidden
      />

      <div className="flex flex-col items-center text-center gap-5 relative z-10">
        {/* 1) 보행 각도 영역 */}
        <div
          className={cx(
            'w-full transition-all duration-800',
            anglesVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 -translate-y-2'
          )}
        >
          <div className="flex items-center gap-2 p-4 justify-center">
            <div className="h-5 w-24 rounded bg-white/10" />
          </div>
          <div className="relative">
            <div className="pointer-events-none absolute left-1/2 top-3 bottom-3 -translate-x-1/2 w-px bg-white/10" />
            <div className="grid grid-cols-2 gap-3">
              <AngleTileSkeleton visible={anglesVisible} />
              <AngleTileSkeleton visible={anglesVisible} />
            </div>
          </div>
        </div>

        {/* 2) 구간 헤더 */}
        <header
          className={cx(
            'mb-3 mt-2 w-full space-y-3 transition-all duration-800',
            headerVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 -translate-y-2'
          )}
        >
          <div className="h-6 w-full rounded bg-white/15" />
          <div className="h-4 w-full rounded bg-white/10" />
          <div className="h-4 w-full rounded bg-white/15" />
        </header>

        {/* 3) 보행 분석 요약 */}
        <div
          className={cx(
            'p-5 rounded-2xl bg-gradient-to-br from-black-800/80 to-black-700/80',
            'border border-white/10 backdrop-blur w-full max-w-sm transition-all duration-800',
            summaryVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 -translate-y-2'
          )}
        >
          <div className="h-4 w-28 rounded bg-white/15 mx-auto mb-4" />
          <div className="space-y-3">
            {[0, 1].map(i => (
              <div key={i} className="flex justify-between items-center">
                <div className="h-3 w-16 rounded bg-white/10" />
                <div className="h-4 w-20 rounded bg-white/15" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 중앙 안내 오버레이: 즉시 표시, 응답까지 유지 */}
      <div className="pointer-events-none absolute inset-0 grid place-items-center">
        <p className="px-3 py-1.5 rounded-full bg-black/50 border border-white/10 text-sm text-white/80 animate-pulse">
          {NOTICE_TEXT}
        </p>
      </div>
    </section>
  )
}

export default function ResultSectionLoading() {
  const step = useLoopingSkeleton()
  return <ResultSectionSkeleton step={step} />
}
