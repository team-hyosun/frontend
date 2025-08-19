export default function BoomRenderPage() {
  // 렌더 단계에서 에러 유발
  // throw new Error('render-bomb')
  return (
    <section className="rounded-3xl p-6 mb-6 bg-red-900/40 border border-red/40 text-white">
      <h2 className="text-lg font-semibold">결과를 불러오지 못했어요</h2>
      <p className="text-sm text-white/80 mt-2">잠시 후 다시 시도해 주세요.</p>
      <div className="mt-4">
        <button className="action-button-base action-button-secondary">
          이전으로
        </button>
      </div>
    </section>
  )
}
