import React, { useMemo } from 'react'

export default function MonthlyRegisterCalendar({
  year,
  month,
  dataByDate = {},
  onDayClick,
}) {
  const pad2 = n => String(n).padStart(2, '0')

  const cells = useMemo(() => {
    const first = new Date(year, month - 1, 1)
    const startWeekIdx = first.getDay()
    const daysInMonth = new Date(year, month, 0).getDate()

    const list = []
    for (let i = 0; i < startWeekIdx; i++)
      list.push({ empty: true, key: `prev-${i}` })
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${pad2(month)}-${pad2(d)}`
      list.push({ empty: false, key: dateStr, dateStr, day: d })
    }
    while (list.length % 7 !== 0)
      list.push({ empty: true, key: `next-${list.length}` })
    if (list.length <= 35)
      while (list.length < 35)
        list.push({ empty: true, key: `pad-${list.length}` })
    else if (list.length < 42)
      while (list.length < 42)
        list.push({ empty: true, key: `pad-${list.length}` })
    return list
  }, [year, month])

  return (
    <div className="rounded-3xl bg-black text-white shadow-[0_8px_30px_rgba(0,0,0,0.2)] overflow-hidden">
      <div className="grid grid-cols-7 border-b border-white/10">
        {['일', '월', '화', '수', '목', '금', '토'].map(w => (
          <div
            key={w}
            className="px-3 py-3 text-center text-sm font-semibold text-primary-400"
          >
            {w}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {cells.map(cell => {
          if (cell.empty)
            return (
              <div
                key={cell.key}
                className="h-24 border-t border-r border-white/10 bg-black/30"
              />
            )
          const stat = dataByDate[cell.dateStr] || {}
          const gait = !!stat.gaitVideo
          const med = !!stat.medication

          return (
            // 영상 O, 약 O = 기본배경
            // 영상 또는 약 X 하나만 X = 노란색
            // 모두 X = 빨간색
            <button
              key={cell.key}
              onClick={() => onDayClick?.(cell.dateStr)}
              className={`relative h-24 border-white/10 text-left p-2
              ${
                !gait && !med
                  ? 'bg-red-600/50'
                  : !gait || !med
                    ? 'bg-yellow-600/50'
                    : ''
              }`}
            >
              <div className="absolute top-1 right-2 text-xs text-white/60">
                {cell.day}
              </div>
              <div className="mt-5 space-y-1 text-[11px] leading-4">
                <div className="flex items-center gap-2 whitespace-nowrap break-keep">
                  <span className="text-white/85">영상</span>
                  <span className={gait ? 'text-white/50' : 'text-red-400'}>
                    {gait ? 'O' : 'X'}
                  </span>
                </div>
                <div className="flex items-center gap-2 whitespace-nowrap break-keep">
                  <span className="text-white/85">약</span>
                  <span className={med ? 'text-white/50' : 'text-red-400'}>
                    {med ? 'O' : 'X'}
                  </span>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
