
import { useMatches, useLocation } from 'react-router-dom';
import { TITLES as T } from '@/constant/routeMeta'

export function usePageMeta() {
  const matches = useMatches();
  const { pathname } = useLocation();
  const last = matches[matches.length - 1];
  return {
    title: last?.handle?.title ?? T[pathname] ?? '',
    isHome: pathname === '/', // index 여부 대신 경로로 판별
  };
}
