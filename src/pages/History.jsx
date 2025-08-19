import React, { useState } from 'react'

import MonthlyRegisterCalendar from '../components/history/MonthlyRegisterCalendar'

export default function CalendarPage() {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth() + 1)

  // 예시 데이터 (실제로는 API에서 받아 맵핑)
  const dataByDate = {
    '2025-09-01': { gaitVideo: true, medication: false },
    '2025-09-02': { gaitVideo: false, medication: true, needsEdit: true },
  }

  const prev = () => {
    const d = new Date(year, month - 2, 1)
    setYear(d.getFullYear())
    setMonth(d.getMonth() + 1)
  }
  const next = () => {
    const d = new Date(year, month, 1)
    setYear(d.getFullYear())
    setMonth(d.getMonth() + 1)
  }

  return (
    <div className="min-h-screen bg-neutral-800 p-6 space-y-4">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <button onClick={prev} className="text-white/80 hover:text-white">
          이전 달
        </button>
        <div className="text-white/70">
          {year}년 {month}월
        </div>
        <button onClick={next} className="text-white/80 hover:text-white">
          다음 달
        </button>
      </div>

      <div className="max-w-5xl mx-auto">
        <MonthlyRegisterCalendar
          year={year}
          month={month}
          dataByDate={dataByDate}
          onDayClick={d => console.log('셀 클릭:', d)}
        />
      </div>
    </div>
  )
}
