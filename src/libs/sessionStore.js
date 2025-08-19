const KEY = id => `result-${id}`
const TTL_MS = 1000 * 60 * 10 // 10분

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
    const fresh = Date.now() - (parsed._ts ?? 0) < TTL_MS

    console.log(`[SessionResultStore] 📥 get ${id}`, {
      data: parsed.data,
      ts: parsed._ts,
      fresh,
    })

    return { data: parsed.data, ts: parsed._ts, fresh }
  } catch (e) {
    console.error(`[SessionResultStore] ⚠️ failed to parse ${id}`, e)
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
    sessionStorage.setItem(KEY(id), JSON.stringify({ _ts: Date.now(), data }))
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
