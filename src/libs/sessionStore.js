const KEY = id => `result-${id}`
const TTL_MS = 1000 * 60 * 10 // 10분

// 경량 해시(FNV-1a 32-bit). 손상 탐지용 (보안 X)
function fnv1a32(str) {
  let h = 0x811c9dc5
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24)
  }
  return (h >>> 0).toString(36)
}

/**
 * 세션스토리지에서 임시 결과 가져오기
 * @param {string} id
 * @returns {{ data: any, ts: number, fresh: boolean } | null}
 */
export function getSessionResult(id) {
  try {
    const raw = sessionStorage.getItem(KEY(id))
    if (!raw) {
      console.log(`[SessionResultStore] ❌ no data for ${id}`)
      return null
    }
    const parsed = JSON.parse(raw)
    const ts = parsed._ts ?? 0
    const fresh = Date.now() - ts < TTL_MS

    if (!fresh) {
      sessionStorage.removeItem(KEY(id))
      console.log(`[SessionResultStore] ⌛ expired ${id}`)
      return null
    }

    // 체크섬 검증 (_chk 없으면 구버전 → 호환 위해 통과)
    const data = parsed.data
    const ok = !parsed._chk || fnv1a32(JSON.stringify(data)) === parsed._chk

    if (!ok) {
      console.warn(`[SessionResultStore] ⚠️ checksum mismatch ${id}`)
      sessionStorage.removeItem(KEY(id))
      return null
    }

    console.log(`[SessionResultStore] 📥 get ${id}`, { data, ts, fresh })
    return { data, ts, fresh }
  } catch (e) {
    console.error(`[SessionResultStore] ⚠️ failed to parse ${id}`, e)
    sessionStorage.removeItem(KEY(id))
    return null
  }
}

/**
 * 세션스토리지에 임시 결과 저장하기
 * @param {string} id
 * @param {any} data
 */
export function setSessionResult(id, data) {
  try {
    const json = JSON.stringify(data)
    const payload = { _ts: Date.now(), data, _chk: fnv1a32(json) }
    sessionStorage.setItem(KEY(id), JSON.stringify(payload))
    console.log(`[SessionResultStore] 💾 set ${id}`, data)
  } catch (e) {
    console.error(`[SessionResultStore] ⚠️ failed to set ${id}`, e)
  }
}

/**
 * 세션스토리지에서 임시 결과 삭제하기
 * @param {string} id
 */
export function clearSessionResult(id) {
  try {
    sessionStorage.removeItem(KEY(id))
    console.log(`[SessionResultStore] 🗑️ clear ${id}`)
  } catch (e) {
    console.error(`[SessionResultStore] ⚠️ failed to clear ${id}`, e)
  }
}
