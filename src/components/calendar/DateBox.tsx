import styled from 'styled-components'
import { ellipsisStyles } from '../../assets/css/global'
import { IAccountBook, MonthDetail } from '../../types'
import { useNavigate } from 'react-router-dom'
import { inputNumberWithComma } from '../../utils/accountBook'
import useCustom from '../../hooks/custom/useCustom'
import editIcon from '../../assets/icons/editIcon.svg'
import plusIcon from '../../assets/icons/plusIcon.svg'
import { useEffect, useState } from 'react'
import useResize from '../../hooks/useResize'

const DateBoxContainer = styled.div<{
  $isCurrentMonth?: boolean
  $isToday?: boolean
}>`
  border-top: 0.1px solid #e4e4e4;
  border-right: 0.1px solid #e4e4e4;
  padding: 0.5rem;

  color: ${({ $isCurrentMonth, theme }) =>
    $isCurrentMonth ? theme.color.gray2 : theme.color.gray1};
  font-size: 0.8rem;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  cursor: pointer;

  &:hover button {
    visibility: visible;
  }

  @media screen and (max-width: 780px) {
    border: none;
    align-items: center;
    row-gap: 0.3rem;
  }
`

const ContentContainer = styled.div`
  display: flex;
  position: relative;
  align-items: center;

  gap: 0.25rem;

  @media screen and (min-width: 1050px) {
    padding-right: 10px;
  }
`

const Date = styled.div<{ $isToday?: boolean; $day?: number }>`
  text-align: center;

  div {
    display: flex;
    justify-content: center;
    align-items: center;

    background: ${({ $isToday, theme }) =>
      $isToday ? theme.color.primary.main : 'transparent'};

    color: ${({ $isToday, theme, $day }) =>
      $isToday
        ? theme.color.white
        : $day === 0
        ? theme.color.red.main
        : $day === 6
        ? theme.color.primary.main
        : 'inherit'};

    width: 1rem;
    height: 1rem;
    padding: 0.1rem;
    border-radius: 50%;
    line-height: 0.9rem;

    font-size: ${({ theme }) => theme.fontSize.xs};
    font-weight: ${({ theme }) => theme.fontWeight.extraBold};
  }
`

const Diary = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.62rem;
  padding: 0.1rem 0.3rem;
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  background-color: ${({ theme }) => theme.color.primary.main};
  color: ${({ theme }) => theme.color.white};

  > span {
    ${ellipsisStyles}
  }

  @media screen and (min-width: 1050px) {
    width: 80%;
  }

  @media screen and (max-width: 1050px) {
    width: 60%;
  }

  @media screen and (max-width: 780px) {
    display: none;
  }
`

const AccountBookList = styled.ul`
  flex: 2;
  overflow-y: auto;
  padding: 0;
  margin: 0.2rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  color: ${({ theme }) => theme.color.gray1};

  @media screen and (max-width: 780px) {
    display: none;
  }
`

const AccountBookItem = styled.li<{ $isIncome: boolean }>`
  display: flex;
  justify-content: space-between;

  color: ${({ $isIncome, theme }) =>
    $isIncome ? theme.color.primary.dark : theme.color.red.dark};
`

const Comment = styled.span`
  ${ellipsisStyles}
  flex: 1;
`

const Price = styled.span`
  ${ellipsisStyles}
  text-align: right;
`

const TotalPrice = styled.div<{ $totalPrice: number }>`
  ${ellipsisStyles}
  border-top: 1px solid ${({ theme }) => theme.color.gray0};
  margin-top: 0.3rem;
  padding-top: 0.3rem;
  display: flex;
  justify-content: flex-end;

  span:nth-of-type(1) {
    font-weight: ${({ theme }) => theme.fontWeight.medium};
  }

  span {
    font-weight: ${({ theme }) => theme.fontWeight.bold};
    font-size: ${({ theme }) => theme.fontSize.sm};
  }

  @media screen and (max-width: 780px) {
    border-top: none;
  }
`

const ActionButton = styled.button`
  border-radius: 0.15rem;
  background: #fcfcfc;
  box-shadow: 1.2px 1.2px 3.6px 0px rgba(97, 97, 97, 0.5);
  border: none;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;

  position: absolute;
  right: 0;
  top: 0;
  padding: 0 0.1rem;
  visibility: hidden;

  @media screen and (max-width: 780px) {
    display: none;
  }
`

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`

const MobileCircle = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${({ theme }) => theme.color.gray1};
`

interface Props {
  selectedDate?: string
  date?: number
  detail?: MonthDetail | null
  isCurrentMonth?: boolean
  isToday?: boolean

  day?: number

  handleDateClick?: (totalPrice: number) => void
}

const DateBox = ({
  selectedDate,
  date,
  detail,
  isCurrentMonth,
  isToday,
  day,
  handleDateClick,
}: Props) => {
  const navigate = useNavigate()
  const { custom } = useCustom()

  const { resize } = useResize()

  function handleContainerClick(account_book?: IAccountBook) {
    if (resize > 780) {
      //데스크탑
      if (detail) {
        //내용이 있을 때
        navigate(`/detail?date=${selectedDate}`, { state: { detail } })
      }
    } else {
      //모바일
      const totalPrice = account_book && getTotalPrice(account_book)
      handleDateClick && handleDateClick(totalPrice ?? -1)
    }
  }

  function handleEditBtnClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation()
    navigate(`/edit?date=${selectedDate}`, { state: { detail } })
  }

  function handleAddBtnClick() {
    navigate(`/write?date=${selectedDate}`)
  }

  // 일간 내역 커스텀에 따라 totalPrice 계산
  function getTotalPrice(accountBook: IAccountBook) {
    let totalPrice = 0

    switch (custom?.daily_result) {
      case 'revenue':
        totalPrice = Object.values(accountBook).reduce((acc, cur) => {
          return cur.is_income ? acc + cur.price : acc - cur.price
        }, 0)
        break

      case 'income':
        totalPrice = Object.values(accountBook).reduce((acc, cur) => {
          return cur.is_income ? acc + cur.price : acc
        }, 0)
        break

      case 'expense':
        totalPrice = Object.values(accountBook).reduce((acc, cur) => {
          return cur.is_income ? acc : acc - cur.price
        }, 0)
        break

      default:
        totalPrice = 0
    }

    return totalPrice
  }

  if (detail) {
    const { diary, account_book } = detail

    return (
      <DateBoxContainer
        $isCurrentMonth={isCurrentMonth}
        onClick={() => handleContainerClick(account_book)}
        $isToday={isToday}
      >
        <ContentContainer>
          <Date $isToday={isToday} $day={day}>
            <div>
              <span>{date}</span>
            </div>
          </Date>
          {diary.title !== '' && (
            <Diary>
              <span>{diary.title}</span>
            </Diary>
          )}
          <ActionButton onClick={handleEditBtnClick}>
            <img src={editIcon} />
          </ActionButton>
        </ContentContainer>

        {resize < 780 ? (
          <MobileCircle />
        ) : (
          account_book && (
            <>
              <AccountBookList>
                {Object.entries(account_book).map(([key, account]) => (
                  <AccountBookItem key={key} $isIncome={account.is_income}>
                    <Comment>{account.category}</Comment>
                    <Price>{inputNumberWithComma(account.price)}원</Price>
                  </AccountBookItem>
                ))}
              </AccountBookList>

              <TotalPrice $totalPrice={getTotalPrice(account_book)}>
                <span>
                  {' '}
                  {inputNumberWithComma(getTotalPrice(account_book))}원{' '}
                </span>
              </TotalPrice>
            </>
          )
        )}
      </DateBoxContainer>
    )
  }

  return (
    <DateBoxContainer
      $isCurrentMonth={isCurrentMonth}
      $isToday={isToday}
      onClick={() => handleContainerClick()}
    >
      <ContentContainer>
        <Date $isToday={isToday} $day={day}>
          <div>{date}</div>
        </Date>

        {isCurrentMonth && (
          <ButtonContainer>
            <ActionButton onClick={handleAddBtnClick}>
              <img src={plusIcon} />
            </ActionButton>
          </ButtonContainer>
        )}
      </ContentContainer>
    </DateBoxContainer>
  )
}

export default DateBox
