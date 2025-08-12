import { Link } from 'react-router-dom'
import {
  FaVideo,
  FaPills,
  FaFileLines,
  FaClockRotateLeft,
} from 'react-icons/fa6'
export default function Home() {
  const userName = '홍길동'

  return (
    <>
      <div className="px-7 flex flex-col gap-8">
        <Background />
        <div className="h-10" />
        <section className="mt-5 flex flex-col gap-3">
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
        <p className="font-thin text-sm text-white-500 leading-snug">{desc}</p>
      </div>
    </Link>
  )
}
