import { create } from 'zustand'

export const useVideoStore = create((set, get) => ({
  file: null,
  url: null,

  setFile: file => {
    const { file: prevFile, url: prevUrl } = get()
    if (prevFile === file) {
      console.log('[useVideoStore] setFile: 같은 파일 참조라 무시', file)
      return
    }

    if (prevUrl) {
      console.log('[useVideoStore] setFile: 이전 URL revoke', prevUrl)
      URL.revokeObjectURL(prevUrl)
    }

    if (file) {
      const url = URL.createObjectURL(file)
      console.log('[useVideoStore] setFile: 새 파일 등록', file, '→ url:', url)
      set({ file, url })
    } else {
      console.log('[useVideoStore] setFile: 파일 없음, 상태 초기화')
      set({ file: null, url: null })
    }
  },
  clear: () => {
    const prevUrl = get().url
    if (prevUrl) {
      console.log('[useVideoStore] clear: 이전 URL revoke', prevUrl)
      URL.revokeObjectURL(prevUrl)
    }
    console.log('[useVideoStore] clear: 상태 초기화')
    set({ file: null, url: null })
  },
}))
