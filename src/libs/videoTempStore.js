import { del, get, set } from 'idb-keyval'

// IndexedDB 키 & 세션 키
const DB_KEY = 'video:enc'
const KEY_K = 'video:key' // sessionStorage (탭 닫히면 소멸)
const TTL_MS = 10 * 60 * 1000 // 10분

const b64 = {
  enc(buf) {
    return btoa(String.fromCharCode(...new Uint8Array(buf)))
  },
  dec(str) {
    return Uint8Array.from(atob(str), c => c.charCodeAt(0)).buffer
  },
}

async function getOrCreateKey() {
  let raw = sessionStorage.getItem(KEY_K)
  if (!raw) {
    const key = await crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    )
    const exported = await crypto.subtle.exportKey('raw', key)
    raw = b64.enc(exported)
    sessionStorage.setItem(KEY_K, raw)
    return key
  }
  const buf = b64.dec(raw)
  return crypto.subtle.importKey('raw', buf, { name: 'AES-GCM' }, false, [
    'encrypt',
    'decrypt',
  ])
}

export async function saveVideoTemp(file) {
  if (!file) return
  const key = await getOrCreateKey()
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const data = await file.arrayBuffer()
  const enc = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, data)

  await set(DB_KEY, {
    iv: Array.from(iv),
    blob: enc, // ArrayBuffer
    name: file.name || 'capture.mp4',
    type: file.type || 'video/mp4',
    ts: Date.now(),
    ttl: TTL_MS,
  })
}

export async function loadVideoTemp() {
  const p = await get(DB_KEY)
  if (!p) return null
  const { ts, ttl, iv, blob, name, type } = p
  if (Date.now() - ts > ttl) {
    await clearVideoTemp()
    return null
  }
  try {
    const key = await getOrCreateKey()
    const dec = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: new Uint8Array(iv) },
      key,
      blob
    )
    return new File([dec], name, { type })
  } catch {
    await clearVideoTemp()
    return null
  }
}

export async function clearVideoTemp() {
  await del(DB_KEY)
  // 필요시 세션 키까지 제거하려면 다음 줄의 주석을 해제:
  // sessionStorage.removeItem(KEY_K)
}
