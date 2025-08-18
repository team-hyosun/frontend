import { ANGLE_THRESHOLDS, ANGLE_STATUS, ANGLE_CONFIG } from '@/constant/angleThreshods';

/**
 * 각도 값에 따라 상태를 분류하는 함수
 * @param {number} angle - 각도 값
 * @returns {string} - ANGLE_STATUS의 값 중 하나 ('good', 'caution', 'danger')
 */
export const classifyAngleStatus = (angle) => {
  if (angle <= ANGLE_THRESHOLDS.GOOD) {
    return ANGLE_STATUS.GOOD;
  }
  if (angle <= ANGLE_THRESHOLDS.WARNING) {
    return ANGLE_STATUS.CAUTION;
  }
  return ANGLE_STATUS.DANGER;
};

/**
 * 각도 값에 따른 완전한 분류 정보를 반환하는 함수
 * @param {number} angle - 각도 값
 * @returns {Object} - 상태, 라벨, 색상 정보 등을 포함한 객체
 */
export const getAngleClassification = (angle) => {
  const status = classifyAngleStatus(angle);
  const config = ANGLE_CONFIG[status];
  
  return {
    angle,
    status,
    label: config.label,
    color: config.color,
    textColor: config.textColor,
    barColor: config.barColor,
  };
};

/**
 * 좌우 각도를 각각 분석하는 함수
 * @param {number} leftAngle - 좌측 각도
 * @param {number} rightAngle - 우측 각도
 * @returns {Object} - 좌우 각각의 분석 결과
 */
export const analyzeAngles = (leftAngle, rightAngle) => {
  const left = getAngleClassification(leftAngle);
  const right = getAngleClassification(rightAngle);
  
  return {
    left,
    right,
  };
};