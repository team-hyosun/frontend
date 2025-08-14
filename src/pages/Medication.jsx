import React, { useState } from 'react'
import styled from '@emotion/styled'
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
    <Container>
      <Title>{titleText}</Title>

      {[
        { key: 'morning', label: 'Q. 아침약을 복용하셨나요?' },
        { key: 'lunch', label: 'Q. 점심약을 복용하셨나요?' },
        { key: 'dinner', label: 'Q. 저녁약을 복용하셨나요?' },
      ].map(item => (
        <Question key={item.key}>
          {item.label}
          <OptionRow>
            <OptionWrapper onClick={() => toggleAnswer(item.key, true)}>
              <OptionBox selected={answers[item.key] === true} />
              <OptionText>예</OptionText>
            </OptionWrapper>
            <OptionWrapper onClick={() => toggleAnswer(item.key, false)}>
              <OptionBox selected={answers[item.key] === false} />
              <OptionText>아니오</OptionText>
            </OptionWrapper>
          </OptionRow>
        </Question>
      ))}

      <NoteLabel>
        특이사항이 있으셨나요?
        <br />
        (구토, 어지러움 등)
      </NoteLabel>
      <NoteInput
        placeholder="내용을 입력해주세요"
        value={note}
        onChange={e => setNote(e.target.value)}
      />
      <SaveButton onClick={handleSave}>저장하기</SaveButton>
    </Container>
  )
}

const Container = styled.div`
  background: #000;
  padding: 40px 30px;
  width: 100%;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Title = styled.div`
  font-size: 28px;
  font-weight: bold;
  color: #00fa9a;
  margin-bottom: 40px;
  text-align: center;
`

const Question = styled.div`
  width: 100%;
  margin-bottom: 30px;
  font-size: 20px;
  text-align: center;
`

const OptionRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-top: 15px;
`

const OptionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
`

const OptionBox = styled.div`
  width: 28px;
  height: 28px;
  border: 2px solid #fff;
  background: ${({ selected }) => (selected ? '#00d88a' : 'transparent')};
  border-radius: 6px;
`

const OptionText = styled.span`
  margin-top: 6px;
  font-size: 14px;
  color: #fff;
`

const NoteLabel = styled.div`
  margin-top: 40px;
  font-size: 16px;
  text-align: center;
  line-height: 1.4;
`

const NoteInput = styled.textarea`
  margin-top: 10px;
  width: 90%;
  height: 70px;
  background: #d9d9d9;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  padding: 10px;
  color: #000;
  resize: vertical;
`
const SaveButton = styled.button`
  margin-top: 30px;
  width: 90%;
  height: 50px;
  background: #00fa9a;
  color: #000;
  font-size: 18px;
  font-weight: bold;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  &:hover {
    background: #00d88a;
  }
`
