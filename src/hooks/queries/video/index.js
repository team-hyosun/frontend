
import { useApiQuery } from '../index';
/**
 * 오늘 영상 등록 가능 여부 조회
 * @returns {boolean} true면 등록 가능, false면 이미 등록됨
 */
export const useTodaySubmission = () => {
    return useApiQuery(
        ['video', 'today-submission'],
        '/walking-record/eligibility',
        {
        staleTime: 1000 * 60 * 60 * 2,
        }
    )
}
