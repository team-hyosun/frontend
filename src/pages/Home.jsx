import {
  FaClockRotateLeft,
  FaFileLines,
  FaPills,
  FaVideo,
} from 'react-icons/fa6'
import { FiLogOut } from 'react-icons/fi'
import { Link, useNavigate } from 'react-router-dom'

import notify from '@/components/ui/notify'
import { useLogoutMutation, useUserMeQuery } from '@/hooks/queries/auth'

// import { getLocalUserName } from '@/libs/localStore'

export default function Home() {
  // const userName = getLocalUserName()
  const { data: name } = useUserMeQuery()
  const userName = name || '홍길동'

  const navigate = useNavigate()
  const logout = useLogoutMutation()

  const handleLogout = async () => {
    const ok = await notify('정말 로그아웃하시겠습니까?')
    if (!ok) return
    logout.mutate(undefined, {
      onSuccess: () => navigate('/auth/login', { replace: true }),
      onError: () => navigate('/auth/login', { replace: true }),
    })
  }
  return (
    <>
      <div className="flex flex-col gap-8">
        <Background />
        <div className="h-3" />
        <section className="mt-1 flex flex-col gap-3">
          <button
            onClick={handleLogout}
            className="p-2 rounded-full"
            title="로그아웃"
          >
            <FiLogOut className="w-5 h-5 text-white-500" />
          </button>
          <h1 className="text-3xl">
            안녕하세요,
            <br /> {userName}님
          </h1>
          <p className="text-white-700">오늘 해야 할 작업을 선택해주세요.</p>
        </section>

        <section className="grid grid-cols-2 gap-4">
          <Tile
            to="/video"
            icon={<FaVideo className="text-xl" />}
            title="영상 등록"
            desc={
              <>
                오늘의 보행 영상을
                <br />
                등록합니다.
              </>
            }
            bgClass="bg-primary-700"
            iconClass="bg-primary-500 text-black-900"
          />
          {/* 2. 약 복용 */}
          <Tile
            to="/medication"
            icon={<FaPills className="text-xl" />}
            title="약 복용"
            desc={
              <>
                오늘 복용 여부를
                <br />
                체크합니다.
              </>
            }
            bgClass="bg-black-700"
            iconClass="bg-black-900 text-white-100"
          />

          <Tile
            to="/report"
            icon={<FaFileLines className="text-xl" />}
            title="보고서"
            desc={
              <>
                측정 결과와
                <br />
                리포트를 확인합니다.
              </>
            }
            bgClass="bg-black-700"
            iconClass="bg-black-900 text-white-100"
          />

          <Tile
            to="/history"
            icon={<FaClockRotateLeft className="text-xl" />}
            title="기록"
            desc={
              <>
                과거 등록 내역을
                <br />
                조회합니다.
              </>
            }
            bgClass="bg-black-600"
            iconClass="bg-black-500 text-white-500"
          />
        </section>
      </div>
    </>
  )
}

function Background() {
  return (
    <div
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      aria-hidden="true"
    >
      <div className="absolute top-15 right-0 w-[200px] h-[300px] bg-[url('/parkin.png')] bg-no-repeat bg-right-top bg-[length:200px_auto] " />
    </div>
  )
}
function Tile({ to, icon, title, desc, bgClass = '', iconClass = '' }) {
  return (
    <Link
      to={to}
      className={`rounded-4xl px-5 py-8 flex flex-col gap-7 ${bgClass}`}
    >
      {/* 아이콘 */}
      <div className="">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center ${iconClass}`}
        >
          {icon}
        </div>
      </div>
      <div className="mb-3">
        {/* 제목 */}
        <div className="text-xl font-semibold mb-2">{title}</div>

        {/* 설명 */}
        <p className="font-mono text-sm text-white-500 leading-snug">{desc}</p>
      </div>
    </Link>
  )
}
