import { IAccountBook } from '../types'
import styled from 'styled-components'
import uuid from 'react-uuid'
import Select from './Select'
import { useEffect } from 'react'
import { inputNumberCheck, inputNumberWithComma } from '../utils/\baccountBook'
import { AiFillMinusCircle } from 'react-icons/ai'

interface AccountBookProps {
  setAccountBook: React.Dispatch<React.SetStateAction<IAccountBook>>
  accountBookData: IAccountBook
}

const isIncomeSelect = [
  { label: '수입', value: 'true' },
  { label: '지출', value: 'false' },
]

const incomeSelect = [
  { label: '월급', value: '월급' },
  { label: '용돈', value: '용돈' },
  { label: '이월', value: '이월' },
  { label: '기타', value: '기타' },
]

const expenseSelect = [
  { label: '식비', value: '식비' },
  { label: '쇼핑', value: '쇼핑' },
  { label: '생활비', value: '생활비' },
  { label: '교통비', value: '교통비' },
]

const AccountBookContainer = styled.div`
  width: 60%;
`

const AccountBookTable = styled.table`
  width: 100%;

  tr > td {
    width: 20%;
    text-align: center;
  }

  tr > td:nth-last-child(1) {
    width: 5%;
  }
`

const AddBtn = styled.button`
  display: flex;
  margin: 50px auto 0;
`

const AccountBook = ({ setAccountBook, accountBookData }: AccountBookProps) => {
  const AddAccountBookItem = () => {
    //가계부 아이템 하나 추가
    setAccountBook((prev) => ({
      ...prev,
      [uuid()]: { is_income: true, price: 0, category: '식비', memo: '' },
    }))
  }

  const deleteAccountBookItem = (key: string) => {
    //가계부 아이템 하나 삭제

    if (accountBookData) {
      delete accountBookData[key] //객체 삭제

      setAccountBook({ ...accountBookData }) //데이터 다시 세팅
    }
  }

  return (
    <AccountBookContainer>
      <h3>가계부</h3>

      <AccountBookTable>
        <thead>
          <tr>
            <td>항목</td>
            <td>카테고리</td>
            <td>메모</td>
            <td>가격</td>
            <td></td>
          </tr>
        </thead>

        <tbody>
          {accountBookData &&
            Object.entries(accountBookData).map(([key, val]) => {
              return (
                <tr key={key}>
                  <td>
                    <Select
                      name='is_income'
                      handleOnChange={(e) => {
                        accountBookData[key].is_income =
                          e === 'true' ? true : false

                        setAccountBook({ ...accountBookData })
                      }}
                      valData={isIncomeSelect}
                      defaultVal={String(val.is_income)}
                    />
                  </td>
                  <td>
                    <Select
                      name='category'
                      handleOnChange={(e) => {
                        accountBookData[key].category = e

                        setAccountBook({ ...accountBookData })
                      }}
                      valData={
                        accountBookData[key].is_income
                          ? incomeSelect
                          : expenseSelect
                      }
                      defaultVal={val.category}
                    />
                  </td>
                  <td>
                    <input
                      type='text'
                      onChange={(e) => {
                        accountBookData[key].memo = e.target.value

                        setAccountBook({ ...accountBookData })
                      }}
                    />
                  </td>
                  <td>
                    <input
                      type='text'
                      value={
                        accountBookData[key].price === 0
                          ? ''
                          : inputNumberWithComma(accountBookData[key].price)
                      }
                      onChange={(e) => {
                        const numPrice = inputNumberCheck(e.target.value)

                        accountBookData[key].price = Number(numPrice)

                        setAccountBook({ ...accountBookData })
                      }}
                    />
                  </td>

                  <td>
                    <AiFillMinusCircle
                      onClick={() => deleteAccountBookItem(key)}
                      style={{ cursor: 'pointer' }}
                    />
                  </td>
                </tr>
              )
            })}
        </tbody>
      </AccountBookTable>

      <AddBtn onClick={AddAccountBookItem}>+ 추가하기</AddBtn>
    </AccountBookContainer>
  )
}

export default AccountBook