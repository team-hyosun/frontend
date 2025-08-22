import React from 'react'
import { useState } from 'react'
import { Line } from 'react-chartjs-2'

import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js'

import { useMonthlyReport, useWeeklyReport } from '../hooks/queries/report'

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
)

export default function WeeklyReport() {
  const { data, isLoading, isError } = useWeeklyReport()
  const monthlyReport = useMonthlyReport()
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  // 차트용 형태 가공
  const toLabel = iso => {
    const d = new Date(iso)
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    return `${mm}/${dd}`
  }

  const weeklyData = (data ?? []).map(d => ({
    date: toLabel(d.date),
    updrs: d.updrsscore,
    leftBias: d.leftTiltAngle, // 왼쪽 편향각
    rightBias: d.rightTiltAngle, // 오른쪽 편향각
  }))
  console.log('weeklyData after mapping:', weeklyData)

  if (isLoading)
    return <div className="p-6 text-white text-center">불러오는 중…</div>
  if (isError)
    return (
      <div className="p-6 text-red-300 text-center">
        리포트를 불러오지 못했어요.
      </div>
    )
  if (!weeklyData.length) {
    console.log('⚠️ weeklyData is empty', weeklyData)
    return (
      <div className="p-6 text-white text-center">표시할 데이터가 없어요.</div>
    )
  }
  // console.log(data)
  const labels = weeklyData.map(item => item.date)

  // UPDRS 점수 차트 데이터
  const updrsData = {
    labels,
    datasets: [
      {
        label: 'UPDRS 점수',
        data: weeklyData.map(item => item.updrs),
        borderColor: '#1f2937',
        backgroundColor: '#1f2937',
        tension: 0.3,
        fill: false,
        pointBackgroundColor: '#1f2937',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
      },
    ],
  }

  // 보행 편향각 차트 데이터
  const biasData = {
    labels,
    datasets: [
      {
        label: '왼쪽 편향각',
        data: weeklyData.map(item => item.leftBias),
        borderColor: '#dc2626',
        backgroundColor: '#dc2626',
        tension: 0.3,
        fill: false,
        pointBackgroundColor: '#dc2626',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5,
      },
      {
        label: '오른쪽 편향각',
        data: weeklyData.map(item => item.rightBias),
        borderColor: '#2563eb',
        backgroundColor: '#2563eb',
        tension: 0.3,
        fill: false,
        pointBackgroundColor: '#2563eb',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5,
      },
    ],
  }
  // 차트 옵션
  const updrsOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#000', font: { size: 14 } },
        position: 'top',
      },
      title: { display: false },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `UPDRS: ${context.parsed.y}점`
          },
        },
      },
    },
    scales: {
      x: {
        ticks: { color: '#000', font: { size: 12 } },
        grid: { color: '#00000015' },
      },
      y: {
        min: 0,
        max: 4,
        ticks: { stepSize: 1, color: '#000', font: { size: 12 } },
        grid: { color: '#00000015' },
        title: {
          display: true,
          text: '점수',
          color: '#000',
          font: { size: 13, weight: 'bold' },
        },
      },
    },
  }

  const biasOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#000', font: { size: 14 } },
        position: 'top',
      },
      title: { display: false },
      tooltip: {
        callbacks: {
          label: function (context) {
            const side = context.dataset.label
            const value = context.parsed.y
            return `${side}: ${value > 0 ? '+' : ''}${value}°`
          },
        },
      },
    },
    scales: {
      x: {
        ticks: { color: '#000', font: { size: 12 } },
        grid: { color: '#00000015' },
      },
      y: {
        min: -4,
        max: 4,
        ticks: {
          stepSize: 1,
          color: '#000',
          font: { size: 12 },
          callback: function (value) {
            return value > 0 ? `+${value}°` : `${value}°`
          },
        },
        grid: { color: '#00000015' },
        title: {
          display: true,
          text: '편향각 (°)',
          color: '#000',
          font: { size: 13, weight: 'bold' },
        },
      },
    },
  }

  // 날짜 차이 계산 (일 단위)
  const getDateDiff = (d1, d2) => {
    const diff = new Date(d2) - new Date(d1)
    return diff / (1000 * 60 * 60 * 24)
  }

  // PDF 다운로드
  const handleDownloadMonthlyPDF = async () => {
    try {
      if (!startDate || !endDate) {
        alert('시작일과 종료일을 모두 선택해주세요.')
        return
      }

      const diff = getDateDiff(startDate, endDate)
      if (diff < 0) {
        alert('종료일은 시작일 이후여야 합니다.')
        return
      }
      if (diff > 31) {
        alert('최대 1개월까지만 선택 가능합니다.')
        return
      }
      const blob = await monthlyReport.mutateAsync({ startDate, endDate })

      const url = window.URL.createObjectURL(new Blob([blob]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute(
        'download',
        `monthly-report-${startDate}_to_${endDate}.pdf`
      )
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (err) {
      console.error('PDF 다운로드 실패:', err)
    }
  }

  return (
    <div className="relative w-full pt-12 px-4">
      <h1 className="text-[2.3rem] font-bold text-primary-600 text-center mb-10">
        주간 보고서
      </h1>
      <div className="space-y-8 max-w-5xl mx-auto">
        {/* UPDRS 점수 차트 */}
        <div className="w-full">
          <h2 className="text-xl font-semibold text-white text-center mb-3">
            UPDRS 점수 추이
          </h2>
          <p className="text-mi text-white-600 text-center mb-4">
            파킨슨병 통합평가척도 <br /> (Unified Parkinson's Disease Rating
            Scale)
          </p>
          <div className="w-full h-[280px] bg-primary-400 mx-auto flex items-center justify-center rounded-[20px] p-4">
            <div className="w-full h-full">
              <Line data={updrsData} options={updrsOptions} />
            </div>
          </div>
        </div>
        {/* 보행각 점수 차트 */}
        <div className="w-full">
          <h2 className="text-xl font-semibold text-white text-center mb-3">
            보행 편향각 분석
          </h2>
          <p className="text-mi text-white-600 text-center mb-4">
            보행 시 좌우 기울어짐 정도 측정 (정상 범위: ±3° 이내)
          </p>
          <div className="w-full h-[280px] bg-primary-400 mx-auto flex items-center justify-center rounded-[20px] p-4">
            <div className="w-full h-full">
              <Line data={biasData} options={biasOptions} />
            </div>
          </div>
        </div>
      </div>
      <p className="text-lg text-white text-center mt-8 mx-auto max-w-lg leading-relaxed">
        일주일간의 UPDRS 점수와 보행 편향각을 종합 분석하여 <br />
        증상의 진행 상태를 모니터링합니다.
      </p>

      <div className="mt-6 text-mi text-white-600 text-center space-y-1">
        <p>• 편향각 음수(-): 왼쪽으로 기울어짐</p>
        <p>• 편향각 양수(+): 오른쪽으로 기울어짐</p>
      </div>
      <hr className="my-12 border-t border-white-400/30" />
      <div className="w-full">
        <h1 className="text-l font-semibold text-primary-600 text-center">
          월간 보행 리포트 생성
        </h1>
      </div>

      <div className="mt-6 text-mi text-white-600 text-center space-y-1">
        <p>• 시작일과 종료일을 선택해주세요. (최대 1개월)</p>
        <p>• 선택한 기간을 기준으로 종합 분석 리포트가 생성됩니다.</p>
      </div>
      <div className="mt-8 flex justify-center items-center space-x-3">
        <div className="flex flex-col items-start">
          <label className="text-white-400 text-sm mb-1">시작일</label>
          <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            placeholder="YYYY-MM-DD"
            className="border border-white-400 rounded-md bg-transparent px-3 py-2 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
          />
        </div>

        <span className="text-white"> ~ </span>

        <div className="flex flex-col items-start">
          <label className="text-white-400 text-sm mb-1">종료일</label>
          <input
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            placeholder="YYYY-MM-DD"
            className="border border-white-400 rounded-md bg-transparent px-3 py-2 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
          />
        </div>
      </div>
      <div className="mt-6 text-center">
        <button
          onClick={handleDownloadMonthlyPDF}
          disabled={monthlyReport.isLoading}
          className="px-10 py-3 mb-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg shadow-md disabled:opacity-50"
        >
          {monthlyReport.isLoading
            ? '다운로드 중...'
            : '월간 보행 리포트 PDF 다운로드'}
        </button>
      </div>
    </div>
  )
}
