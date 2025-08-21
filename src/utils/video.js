function isVideoFile(file) {
  if (!file) return false
  // 1) MIME 우선
  if (typeof file.type === 'string' && file.type.startsWith('video/'))
    return true
  // 2) 일부 환경에서 type이 빈 값일 때 확장자 보조
  const name = (file.name || '').toLowerCase()
  return /\.(mp4|mov|webm|m4v|3gp|3g2|mkv)$/i.test(name)
}

export function validateVideoFile(file, { maxSizeMB = 100 } = {}) {
  if (!isVideoFile(file)) return { ok: false, reason: 'NOT_VIDEO' }
  const maxBytes = maxSizeMB * 1024 * 1024
  if (file.size > maxBytes) return { ok: false, reason: 'TOO_LARGE', maxSizeMB }
  return { ok: true }
}

// Url > file 복구
export async function fileFromUrl(
  url,
  fallbackType = 'video/mp4',
  filename = 'capture.mp4'
) {
  if (!url) return null
  try {
    const res = await fetch(url)
    const blob = await res.blob()
    const type = blob.type || fallbackType
    return new File([blob], filename, { type })
  } catch {
    return null
  }
}
