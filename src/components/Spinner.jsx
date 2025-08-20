import { FaSpinner } from 'react-icons/fa'

import { cn } from '@/utils/cn'

export default function Spinner({ size = 20, className = '' }) {
  return (
    <div
      className={cn(
        'flex items-center justify-center text-slate-300',
        className
      )}
      role="status"
      aria-live="polite"
    >
      <FaSpinner
        className="animate-spin"
        style={{ width: size, height: size, animationDuration: '3s' }}
        aria-hidden="true"
      />
    </div>
  )
}
