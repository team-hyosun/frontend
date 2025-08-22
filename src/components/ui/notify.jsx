import toast from 'react-hot-toast'

export default function notify(
  message,
  { confirmLabel = '예', cancelLabel = '아니오', duration = Infinity } = {}
) {
  return new Promise(resolve => {
    toast.custom(
      t => (
        <div
          role="dialog"
          aria-modal="true"
          className="w-[92vw] max-w-[420px] rounded-lg bg-black-700 text-white border border-white/10 p-4"
          style={{ touchAction: 'manipulation' }}
          onPointerDown={e => e.stopPropagation()} // 카드 클릭 무시
        >
          <p className="text-md">{message}</p>
          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              className="h-9 w-24 rounded-md border border-white/10 text-sm text-white/90"
              // ↓ 클릭 지연 제거 + 즉시 제거
              onPointerDown={e => {
                e.preventDefault()
                resolve(false)
                toast.remove(t.id) // 애니메이션 없이 바로 제거
              }}
              autoFocus
              style={{ touchAction: 'manipulation' }}
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              className="h-9 w-24 rounded-md bg-white/10 text-sm text-white"
              onPointerDown={e => {
                e.preventDefault()
                resolve(true)
                toast.remove(t.id)
              }}
              style={{ touchAction: 'manipulation' }}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      ),
      { duration } // 종료는 버튼으로만
    )
  })
}
