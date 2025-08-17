import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function MedicationCheck() {
  const navigate = useNavigate()
  const [answers, setAnswers] = useState({
    morning: null,
    lunch: null,
    dinner: null,
  })
  const [note, setNote] = useState('')

  const today = new Date()
  const month = today.getMonth() + 1
  const date = today.getDate()
  const dayNames = ['일', '월', '화', '수', '목', '금', '토']
  const day = dayNames[today.getDay()]
  const titleText = `${month}/${date}(${day}) 약 복용 확인`

  const toggleAnswer = (time, value) => {
    setAnswers({ ...answers, [time]: value })
  }

  const handleSave = () => {
    console.log('저장 데이터:', { answers, note })
    alert('약 복용 정보가 저장되었습니다.')
    navigate('/')
  }

  return (
    <div className="px-7 py-10 w-full text-white flex flex-col items-center">
      <h1 className="text-[2rem] font-bold text-primary-400 mb-10 text-center">
        {titleText}
      </h1>
      {[
        { key: 'morning', label: 'Q. 아침약을 복용하셨나요?' },
        { key: 'lunch', label: 'Q. 점심약을 복용하셨나요?' },
        { key: 'dinner', label: 'Q. 저녁약을 복용하셨나요?' },
      ].map(item => (
        <div key={item.key} className="w-full mb-7 text-[1.5rem] text-center">
          {item.label}
          <div className="flex justify-center gap-10 mt-4">
            <div 
              className="flex flex-col items-center cursor-pointer"
              onClick={() => toggleAnswer(item.key, true)}
            >
              <div className={`w-7 h-7 border-2 border-white rounded-md ${
                answers[item.key] === true ? 'bg-primary-500' : 'bg-transparent'
              }`} />
              <span className="mt-1.5 text-sm text-white">예</span>
            </div>
            <div 
              className="flex flex-col items-center cursor-pointer"
              onClick={() => toggleAnswer(item.key, false)}
            >
              <div className={`w-7 h-7 border-2 border-white rounded-md ${
                answers[item.key] === false ? 'bg-primary-400' : 'bg-transparent'
              }`} />
              <span className="mt-1.5 text-sm text-white">아니오</span>
            </div>
          </div>
        </div>
      ))}

      <div className="mt-10 text-base text-center leading-relaxed">
        특이사항이 있으셨나요?
        <br />
        (구토, 어지러움 등)
      </div>
      
      <textarea
        className="mt-2.5 w-[90%] h-[70px] bg-white-300 border-none rounded-lg text-base p-2.5 text-black resize-y"
        placeholder="내용을 입력해주세요"
        value={note}
        onChange={e => setNote(e.target.value)}
      />

      <button
        className="mt-7 w-[90%] h-12 bg-primary-400 text-black text-lg font-bold border-none rounded-[20px] cursor-pointer hover:bg-primary-500 transition-colors"
        onClick={handleSave}
      >
        저장하기
      </button>
    </div>
  )
}