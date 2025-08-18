export default function BoomRenderPage() {
  // 렌더 단계에서 에러 유발
  throw new Error('render-bomb')
}
