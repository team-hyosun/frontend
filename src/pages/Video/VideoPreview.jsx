import toast from 'react-hot-toast'
import {
  AiOutlineCheckCircle,
  AiOutlineExclamationCircle,
  AiOutlineReload,
} from 'react-icons/ai'
import { useNavigate } from 'react-router-dom'

import { clearVideoTemp, saveVideoTemp } from '@/libs/videoTempStore'
import { useVideoStore } from '@/stores/videoStore'

export default function VideoPreviewPage() {
  const file = useVideoStore(s => s.file)
  const url = useVideoStore(s => s.url)
  const clear = useVideoStore(s => s.clear)

  const navigate = useNavigate()

  const handleRetake = async () => {
    clear()
    await clearVideoTemp() // ✅ 임시 저장 삭제
    navigate('/video?capture=1', { replace: true })
  }

  const handleUpload = async () => {
    if (!file) {
      toast('업로드할 영상이 없습니다.')
      return
    }
    try {
      await saveVideoTemp(file) // ✅ 임시 저장
    } catch {
      // 저장 실패해도 업로드는 진행
    }
    navigate('/video/result', { replace: true }) // 업로드는 Pending에서
  }

  return (
    <main data-testid="preview-page" className="flex flex-col py-6 gap-6">
      <PageHeader />
      <VideoPreview url={url} />
      <ActionButtons onRetake={handleRetake} onSubmit={handleUpload} />
    </main>
  )
}

function VideoPreview({ url, error }) {
  return (
    <section aria-labelledby="video-preview-title">
      <h2 id="video-preview-title" className="sr-only">
        영상 미리보기
      </h2>

      <div className="rounded-2xl bg-black-700 ring-1 ring-black-600 overflow-hidden">
        {url ? <VideoPlayer src={url} /> : <EmptyVideoState />}
      </div>

      {error && (
        <div role="alert" className="mt-3">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}
    </section>
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

function VideoPlayer({ src }) {
  if (!src) return null
  return (
    <div className="aspect-video">
      <video
        className="w-full h-full object-contain bg-black"
        src={src}
        controls
        playsInline
        aria-label="미리보기 영상"
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

function ActionButtons({ onRetake, onSubmit }) {
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
          ariaLabel={'영상을 제출하여 분석 시작'}
        >
          제출하기
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
