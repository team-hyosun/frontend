export function getLocalUserName(defaultName = '멋쟁이') {
  try {
    if (typeof window === 'undefined') return defaultName
    const v = localStorage.getItem('userName')
    return v && v.trim().length > 0 ? v : defaultName
  } catch {
    return defaultName
  }
}
