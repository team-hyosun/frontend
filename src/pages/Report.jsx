import React from 'react'
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

import { useWeeklyReport } from '../hooks/queries/report'

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

  if (isLoading)
    return <div className="p-6 text-white text-center">불러오는 중…</div>
  if (isError)
    return (
      <div className="p-6 text-red-300 text-center">
        리포트를 불러오지 못했어요.
      </div>
    )
  if (!weeklyData.length)
    return (
      <div className="p-6 text-white text-center">표시할 데이터가 없어요.</div>
    )

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
            보행 시 좌우 기울어짐 정도 측정 (정상 범위: ±2° 이내)
          </p>
          <div className="w-full h-[280px] bg-primary-400 mx-auto flex items-center justify-center rounded-[20px] p-4">
            <div className="w-full h-full">
              <Line data={biasData} options={biasOptions} />
            </div>
          </div>
        </div>
      </div>

      <p className="text-lg text-white text-center mt-8 mx-auto max-w-lg leading-relaxed">
        환자분의 일주일간 UPDRS 점수와 보행 편향각을 분석하여 <br />
        파킨슨병 증상의 진행 상태를 모니터링합니다.
      </p>

      <div className="mt-6 text-mi text-white-600 text-center space-y-1">
        <p>• 편향각 음수(-): 왼쪽으로 기울어짐</p>
        <p>• 편향각 양수(+): 오른쪽으로 기울어짐</p>
      </div>
    </div>
  )
}
