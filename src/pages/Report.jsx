import React from 'react'
import styled from '@emotion/styled'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

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
  // 예시 데이터 (0~4등급)
  const weeklyData = [
    { date: '2025-08-01', grade: 0 },
    { date: '2025-08-02', grade: 1 },
    { date: '2025-08-03', grade: 2 },
    { date: '2025-08-04', grade: 1 },
    { date: '2025-08-05', grade: 3 },
    { date: '2025-08-06', grade: 4 },
    { date: '2025-08-07', grade: 2 },
  ]
  const labels = weeklyData.map(item => item.date)
  const grades = weeklyData.map(item => item.grade)

  const data = {
    labels,
    datasets: [
      {
        label: '구간',
        data: grades,
        borderColor: '#000',
        backgroundColor: '#000',
        tension: 0.3,
        fill: false,
        pointBackgroundColor: '#000',
        pointBorderColor: '#fff',
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#000' } },
      title: { display: false },
    },
    scales: {
      x: { ticks: { color: '#000' } },
      y: {
        min: 0,
        max: 4,
        ticks: { stepSize: 1, color: '#000' },
      },
    },
  }
  return (
    <Container>
      <ReportTitle>주간 보고서</ReportTitle>

      <ChartWrapper>
        <Line data={data} options={options} />
      </ChartWrapper>

      <Description>
        환자분의 일주일 기록을 분석하여 <br />
        차트로 진행 추이를 나타낸 것입니다.
      </Description>
    </Container>
  )
}

const Container = styled.div`
  position: relative;
  width: 100%;
  padding-top: 50px;
`

const ReportTitle = styled.h1`
  font-size: 38px;
  font-weight: 700;
  color: #00fa9a;
  text-align: center;
  margin-bottom: 40px;
`

const ChartWrapper = styled.div`
  width: 80%;
  height: 300px;
  background: #00fa9a;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  canvas {
    width: 100% !important;
    height: 100% !important;
  }
`

const Description = styled.p`
  font-size: 20px;
  color: #fff;
  text-align: center;
  margin: 30px auto 0;
  width: 349px;
  line-height: 1.2;
`
