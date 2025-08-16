import { create } from 'zustand'

export const useVideoStore = create((set, get) => ({
  // 오늘 촬영한 영상 메타데이터 (임시)
  todayVideoMeta: null,

  // 오늘 영상 메타데이터 설정
  setTodayVideoMeta: (metadata) => set({
    todayVideoMeta: {
      name: metadata.name,
      size: metadata.size,
      capturedAt: new Date().toISOString()
    }
  }),

  // 오늘 영상 메타데이터 가져오기
  getTodayVideoMeta: () => {
    const { todayVideoMeta } = get()
    return todayVideoMeta
  },

  // 오늘 영상 제거 (재촬영, 업로드 실패시)
  clearTodayVideo: () => set({ 
    todayVideoMeta: null 
  }),
}))