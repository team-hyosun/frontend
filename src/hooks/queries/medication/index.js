import { useMutation, useQuery } from '@tanstack/react-query'

import { authenticated } from '../../../libs/api'

const toServerValue = v => (v === true ? 'YES' : v === false ? 'NO' : 'NONE')
const toDateStr = (d = new Date()) => d.toISOString().slice(0, 10)

// 오늘의 복약 기록 등록
export function useCreateMedicationRecord() {
  return useMutation({
    mutationFn: async ({ answers, note, recordDate }) => {
      const payload = {
        morningTaken: toServerValue(answers.morning),
        lunchTaken: toServerValue(answers.lunch),
        dinnerTaken: toServerValue(answers.dinner),
        recordDate: recordDate ?? toDateStr(),
        medicationNotes: note ?? '',
      }
      const { data } = await authenticated.post('/medication-record', payload)

      return data
    },
  })
}

// 오늘 복약 등록 가능 여부 조회
export function useMedicationEligibility(options = {}) {
  return useQuery({
    queryKey: ['medication', 'eligibility'],
    queryFn: async () => {
      const { data } = await authenticated.get('/medication-record/eligibility')
      // 백엔드에서 true/false 반환
      return data.payload
    },

    staleTime: 1000 * 60, // 1분
    gcTime: 1000 * 60 * 5,
    ...options,
  })
}
