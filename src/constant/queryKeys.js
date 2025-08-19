// submit
export const QUERY_KEY_CAN_SUBMIT_TODAY = ['video', 'today-submission']
export const ENDPOINT_CAN_SUBMIT_TODAY = '/walking-record/eligibility'

// upload
export const QUERY_KEY_TODAY_RESULT = ['video', 'result', 'today']
// export const ENDPOINT_TODAY_RESULT = date =>
//   `/walking-record/date?date=${encodeURIComponent(date)}`

export const ENDPOINT_VIDEO_UPLOAD = date =>
  `/walking-record?date=${encodeURIComponent(date)}`
