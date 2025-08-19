import { useEffect } from 'react'
import { useRef } from 'react'
import {
  AiOutlineCamera,
  AiOutlineCloudUpload,
  AiOutlinePlayCircle,
} from 'react-icons/ai'
import { FiAlertTriangle, FiCheck } from 'react-icons/fi'
import { useLocation, useNavigate } from 'react-router-dom'

import frontGuide from '@/assets/images/front-walk-guide.png'
import sideGuide from '@/assets/images/side-walk-guide.png'
import { useTodaySubmission } from '@/hooks/queries/video'
import { useVideoStore } from '@/stores/videoStore'
import { validateVideoFile } from '@/utils/video'

export default function VideoGuide() {
  const { data: canRegister } = useTodaySubmission()
  const setFile = useVideoStore(s => s.setFile)
  const fileInputRef = useRef(null)
  const navigate = useNavigate()
  useEffect(() => {
    console.log('canRegister changed:', canRegister)
  }, [canRegister])

  const location = useLocation()
  useEffect(() => {
    if (location.search.includes('capture=1')) {
      openPicker(true) // 카메라 열기
      navigate('/video', { replace: true }) // URL 정리 (쿼리 제거)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search])

  // 공용: input 열기 (capture on/off)
  const openPicker = useCamera => {
    const el = fileInputRef.current
    if (!el) return
    if (useCamera) el.setAttribute('capture', 'environment')
    else el.removeAttribute('capture')
    el.click()
  }

  const handleSelectFile = () => openPicker(false)
  const handleRecord = () => {
    if (/Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)) {
      // 모바일 → capture input 실행
      openPicker(true)
    } else {
      // 데스크탑 웹 → 카메라 없음 안내
      alert(
        '데스크탑에서는 카메라 촬영이 지원되지 않습니다. 모바일 기기에서 이용해주세요.'
      )
    }
  }
  const handleChange = e => {
    const f = e.target.files?.[0]
    if (!f) return
    const v = validateVideoFile(f, { maxSizeMB: 100 })
    if (!v.ok) {
      alert(
        v.reason === 'NOT_VIDEO'
          ? '동영상만 업로드 가능해요.'
          : '파일이 너무 큽니다.'
      )
      e.target.value = ''
      return
    }
    setFile(f) // store가 url까지 생성
    e.target.value = '' // 같은 파일 재선택 대비 초기화
    navigate('/video/preview')
  }

  return (
    <main className="flex flex-col py-6 gap-6">
      <PageHeader />
      <CaptureGuide />
      <WarningSection />
      {canRegister === false && <AlreadySubmittedSection />}
      {/* 숨김 파일 입력 (웹/PWA/앱 웹뷰 공통) */}
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={handleChange}
      />
      <ActionButtons
        isDisabled={!canRegister}
        onSelectFile={handleSelectFile}
        onRecord={handleRecord}
      />
    </main>
  )
}

function PageHeader() {
  return (
    <header>
      <div className="flex flex-col gap-3">
        <h1 className="text-2xl font-medium">가이드 영상</h1>
        <p className="text-xs text-white-800">
          이미지를 클릭하면 실제 영상 예시(YouTube)로 이동합니다.
        </p>
      </div>
    </header>
  )
}

function WarningSection() {
  return (
    <section
      aria-labelledby="warning-title"
      className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 flex items-start gap-3"
    >
      <FiAlertTriangle
        className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0"
        aria-hidden="true"
      />
      <div>
        <h2 id="warning-title" className="sr-only">
          중요 안내
        </h2>
        <p className="text-sm leading-relaxed text-red-400">
          가이드 영상을 확인한 후 해당 형식으로{' '}
          <strong className="font-semibold">영상을 촬영</strong>해주세요.
        </p>
      </div>
    </section>
  )
}

function AlreadySubmittedSection() {
  return (
    <section
      aria-labelledby="submitted-title"
      className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 flex items-start gap-3"
    >
      <FiCheck
        className="h-5 w-5 text-amber-400 mt-0.5 flex-shrink-0"
        aria-hidden="true"
      />
      <div>
        <h2 id="submitted-title" className="sr-only">
          오늘 촬영 완료 안내
        </h2>
        <p className="text-sm leading-relaxed text-amber-400">
          오늘 이미 <strong className="font-semibold">영상을 제출</strong>
          하셨습니다. 내일부터 다시 촬영 가능합니다.
        </p>
      </div>
    </section>
  )
}

function ActionButtons({ isDisabled, onSelectFile, onRecord }) {
  return (
    <section aria-labelledby="actions-title">
      <h2 id="actions-title" className="sr-only">
        촬영 및 업로드 옵션
      </h2>
      <div className="grid grid-cols-2 gap-3">
        <ActionCard
          onClick={onSelectFile}
          title="영상 파일 선택"
          subtitle="Album"
          icon={AiOutlineCloudUpload}
          variant="secondary"
          disabled={isDisabled}
          ariaLabel="앨범에서 영상 파일을 선택하여 업로드"
        />
        <ActionCard
          onClick={onRecord}
          title="촬영하기"
          subtitle="Record"
          icon={AiOutlineCamera}
          variant="primary"
          disabled={isDisabled}
          ariaLabel="카메라를 사용하여 바로 영상 촬영"
        />
      </div>
    </section>
  )
}

function ActionCard({
  onClick,
  title,
  subtitle,
  icon: Icon,
  variant = 'secondary',
  ariaLabel,
  disabled = false,
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`action-card-base action-card-${variant} relative ${
        disabled
          ? 'opacity-40 saturate-0 pointer-events-none'
          : 'active:scale-95 transition-all duration-200'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="action-card-title">{title}</div>
          <div className="action-card-subtitle">{subtitle}</div>
        </div>
        <div className="action-card-icon" aria-hidden="true">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </button>
  )
}

function CaptureGuide() {
  return (
    <section aria-labelledby="capture-guide-title">
      <h2 id="capture-guide-title" className="sr-only">
        촬영 가이드
      </h2>

      <div className="flex gap-4 flex-row items-start mb-4">
        <VerticalGuideVideo />
        <GuideInstructions />
      </div>

      <HorizontalGuideVideo />
    </section>
  )
}

function VerticalGuideVideo() {
  const frontGuideLink = 'https://www.youtube.com/shorts/SDQylNnywcI'
  const frontGuideTitle = '세로 예시 1'
  const frontGuideDesc = '세로 예시 1 (클릭 시 유튜브 예시 영상 이동)'

  return (
    <a
      href={frontGuideLink}
      target="_blank"
      rel="noreferrer"
      className="group block rounded-lg overflow-hidden bg-black/10 transition-all duration-200"
      title={frontGuideDesc}
      aria-label={`${frontGuideTitle} – 이미지 클릭 시 유튜브 예시 영상으로 이동`}
    >
      <div className="relative aspect-[9/16] bg-black">
        <img
          src={frontGuide}
          alt={frontGuideTitle}
          className="absolute inset-0 h-full w-full object-contain"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20" />
        <div className="absolute inset-0 grid place-items-center pointer-events-none">
          <div className="size-12 rounded-full grid place-items-center bg-black/40 backdrop-blur border border-white/20 transition-transform duration-200">
            <AiOutlinePlayCircle
              className="h-5 w-5 translate-x-[2px]"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
      <div className="p-3 flex items-center justify-between gap-2">
        <span className="text-sm truncate">{frontGuideTitle}</span>
        <span className="text-xs text-white/60" aria-label="유튜브로 이동">
          YouTube
        </span>
      </div>
    </a>
  )
}

function GuideInstructions() {
  const guideText =
    '화면에서는 사람이 <strong>작게</strong> 보이도록 <strong>앞으로 5초</strong> 걷고, 돌아서 <strong>반대 방향으로 5초</strong> 걷습니다. 카메라는 <strong>고정</strong>하세요.'

  const guideList = [
    '머리부터 발끝까지 전신이 나오게 촬영',
    '오른쪽 → 왼쪽 이동 후, 프레임 벗어나기 전 방향 전환',
    '3~5m 구간 왕복으로 보폭·속도 측정',
    '발 기준 <strong>가이드 라인</strong>이 있으면 더 정확합니다.',
  ]

  return (
    <aside
      className="flex-[3] basis-0 self-start rounded-lg p-4 bg-black-700 ring-1 ring-white/10"
      aria-labelledby="guide-instructions-title"
    >
      <h3 id="guide-instructions-title" className="sr-only">
        촬영 방법 안내
      </h3>
      <p
        className="text-sm leading-relaxed mb-3"
        dangerouslySetInnerHTML={{ __html: guideText }}
      />
      <ul className="space-y-2 text-sm">
        {guideList.map((item, idx) => (
          <li key={idx} className="flex items-start gap-2">
            <span className="text-primary-400 mt-1.5 text-xs">•</span>
            <span dangerouslySetInnerHTML={{ __html: item }} />
          </li>
        ))}
      </ul>
    </aside>
  )
}

function HorizontalGuideVideo() {
  const sideGuideLink = 'https://youtu.be/-QBi7_fb4D8'
  const sideGuideTitle = '가로 예시'
  const sideGuideDesc = '가로 예시 (클릭 시 유튜브 예시 영상 이동)'

  return (
    <a
      href={sideGuideLink}
      target="_blank"
      rel="noreferrer"
      className="group block rounded-lg overflow-hidden bg-black/10 transition-all duration-200"
      title={sideGuideDesc}
      aria-label={`${sideGuideTitle} – 이미지 클릭 시 유튜브 예시 영상으로 이동`}
    >
      <div className="relative aspect-[16/9] bg-black">
        <img
          src={sideGuide}
          alt={sideGuideTitle}
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20" />
        <div className="absolute inset-0 grid place-items-center pointer-events-none">
          <div className="size-12 rounded-full grid place-items-center bg-black/40 backdrop-blur border border-white/20 transition-transform duration-200">
            <AiOutlinePlayCircle
              className="h-5 w-5 translate-x-[2px]"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
      <div className="p-3 flex items-center justify-between gap-2">
        <span className="text-sm truncate">{sideGuideTitle}</span>
        <span className="text-xs text-white/60" aria-label="유튜브로 이동">
          YouTube
        </span>
      </div>
    </a>
  )
}
