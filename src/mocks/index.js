export async function startMsw() {
  if (typeof window === 'undefined') return
  const { worker } = await import('./browser')
  await worker.start({
    serviceWorker: { url: '/mockServiceWorker.js' },
    onUnhandledRequest: 'bypass', // 핸들러 없는 건 실제 서버로 통과
    // quiet: true,
  })
  console.info('[MSW] enabled') // ✅ 확실한 배너
}
