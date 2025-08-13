// src/components/ui/Header.jsx
import { FaPatreon, FaRegBell, FaChevronLeft } from 'react-icons/fa6'

/* Frame */
function Header({ children, className = '' }) {
  return (
    <header
      className={`h-14 px-4 flex items-center justify-between bg-surface text-text ${className}`}
    >
      {children}
    </header>
  )
}

function Left({ children, className = '' }) {
  return (
    <div className={`min-w-[48px] flex items-center ${className}`}>
      {children}
    </div>
  )
}
function Center({ children, className = '' }) {
  return (
    <div className={`flex-1 flex items-center justify-center ${className}`}>
      {children}
    </div>
  )
}
function Right({ children, className = '' }) {
  return (
    <div className={`min-w-[48px] flex items-center justify-end ${className}`}>
      {children}
    </div>
  )
}

function Logo({ size = 28, className = '' }) {
  return <FaPatreon size={size} aria-hidden className={className} />
}
function Back({ onClick, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="뒤로가기"
      className={`tap-target rounded-full p-2 hover:bg-black-400 ${className}`}
    >
      <FaChevronLeft size={20} aria-hidden />
    </button>
  )
}
function Title({ children, className = '' }) {
  return <h1 className={`text-xl font-semibold ${className}`}>{children}</h1>
}
function Bell({ count = 0, onClick, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="알림"
      className={`relative p-2 rounded-full hover:bg-black-400 ${className}`}
    >
      <FaRegBell size={20} aria-hidden />
      {count > 0 && (
        <span className="absolute top-1 right-1 w-2 h-2 bg-primary-500 rounded-full" />
      )}
    </button>
  )
}

export default Object.assign(Header, {
  Left,
  Center,
  Right,
  Logo,
  Back,
  Title,
  Bell,
})
