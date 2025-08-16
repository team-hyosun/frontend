import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import {
  AiOutlineReload,
  AiOutlineCheckCircle,
  AiOutlineExclamationCircle,
} from 'react-icons/ai'

export default function VideoPreviewPage() {
  const navigate = useNavigate()
  const { state } = useLocation()
  // prev page에서 { file } 또는 { src: blob/object URL } 형태로 넘겨주세요.
  const file = state?.file ?? null
  const passedSrc = state?.src ?? ''

  // file이 넘어오면 ObjectURL 생성
  const objectUrl = useMemo(
    () => (file ? URL.createObjectURL(file) : ''),
    [file]
  )

  useEffect(
    () => () => objectUrl && URL.revokeObjectURL(objectUrl),
    [objectUrl]
  )

  const videoSrc = passedSrc || objectUrl
  const [submitting, setSubmitting] = useState(false)
  const [err, setErr] = useState('')

  const handleRetake = () => navigate(-1)

  const handleSubmit = () => {
    const id = 123
    console.log('submit ', id)
    navigate(`/video/result/${id}`)
  }

  return (
    <main className="flex flex-col py-6 gap-6">
      <PageHeader />
      <VideoPreview videoSrc={videoSrc} error={err} />
      <ActionButtons
        onRetake={handleRetake}
        onSubmit={handleSubmit}
        isSubmitting={submitting}
      />
    </main>
  )
}

function PageHeader() {
  return (
    <header>
      <h1 className="text-2xl font-semibold tracking-[-0.02em]">
        영상 미리보기
      </h1>
      <p className="text-sm text-zinc-400 mt-1">
        촬영된 영상을 확인한 뒤 제출하거나 재촬영할 수 있어요.
      </p>
    </header>
  )
}

function VideoPreview({ videoSrc, error }) {
  return (
    <section aria-labelledby="video-preview-title">
      <h2 id="video-preview-title" className="sr-only">
        영상 미리보기
      </h2>

      <div className="rounded-2xl bg-black-700 ring-1 ring-black-600 overflow-hidden">
        {videoSrc ? <VideoPlayer src={videoSrc} /> : <EmptyVideoState />}
      </div>

      {error && (
        <div role="alert" className="mt-3">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}
    </section>
  )
}

function VideoPlayer({ src }) {
  return (
    <div className="aspect-video">
      <video
        className="w-full h-full object-contain bg-black"
        src={src}
        controls
        playsInline
        aria-label="미리보기 영상"
        // iOS 자동재생 필요 시 muted + autoPlay를 추가(권장하지 않으면 생략)
      />
    </div>
  )
}

function EmptyVideoState() {
  return (
    <div className="aspect-video grid place-items-center">
      <div className="flex flex-col items-center gap-2 text-white-700">
        <AiOutlineExclamationCircle size={28} aria-hidden="true" />
        <span className="text-sm">미리볼 영상이 없습니다.</span>
      </div>
    </div>
  )
}

function ActionButtons({ onRetake, onSubmit, isSubmitting }) {
  return (
    <footer>
      <div className="flex gap-3" role="group" aria-label="영상 처리 옵션">
        <ActionButton
          onClick={onRetake}
          icon={AiOutlineReload}
          variant="secondary"
          ariaLabel="이전 화면으로 돌아가서 영상을 다시 촬영"
        >
          재촬영
        </ActionButton>
        <ActionButton
          onClick={onSubmit}
          icon={AiOutlineCheckCircle}
          variant="primary"
          disabled={isSubmitting}
          ariaLabel={
            isSubmitting
              ? '영상을 제출하는 중입니다'
              : '영상을 제출하여 분석 시작'
          }
        >
          {isSubmitting ? '제출 중...' : '제출하기'}
        </ActionButton>
      </div>
    </footer>
  )
}

function ActionButton({
  onClick,
  icon: Icon,
  variant = 'secondary',
  disabled = false,
  ariaLabel,
  children,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`action-button-base action-button-${variant}`}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      <span>{children}</span>
    </button>
  )
}
