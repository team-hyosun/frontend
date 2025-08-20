// 각도 분류 기준과 UI 스타일 상수
export const ANGLE_THRESHOLDS = {
  GOOD: 3.5, // 양호 기준 (이하)
  WARNING: 5.0, // 경고 기준 (이하)
}

export const ANGLE_STATUS = {
  GOOD: 'good',
  CAUTION: 'caution',
  DANGER: 'danger',
}

export const ANGLE_CONFIG = {
  [ANGLE_STATUS.GOOD]: {
    label: '양호',
    color: 'green',
    textColor: 'text-green-600 font-semibold',
    barColor: 'bg-gradient-to-r from-green-600 to-black-200',
  },
  [ANGLE_STATUS.CAUTION]: {
    label: '주의',
    color: 'yellow',
    textColor: 'text-yellow-500 font-semibold',
    barColor: 'bg-gradient-to-r from-yellow-400 to-black-200',
  },
  [ANGLE_STATUS.DANGER]: {
    label: '경고',
    color: 'red',
    textColor: 'text-red-300 font-semibold',
    barColor: 'bg-gradient-to-r from-red-300 to-black-200',
  },
}
