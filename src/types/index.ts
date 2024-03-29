export interface TotalPrice {
  income_price: number
  expense_price: number
}

export interface IDiary {
  title: string
  emotion: string
  content: string
}

export interface IAccountBook {
  [key: string]: {
    memo: string
    price: number
    category: string
    is_income: boolean
    payment_type: string
  }
}

export interface MonthDetail {
  diary: IDiary
  account_book: IAccountBook
}

export interface Books {
  [key: string]: MonthDetail | TotalPrice
  total: TotalPrice
}

// 고정 지출
export interface IFixedExpense {
  [key: string]: {
    payment_period: { start_date: string; end_date: string }
    payment_day: string
    category: string
    memo: string
    price: number
    payment_type: string
  }
}

// 예상 한도
export interface IExpectedLimit {
  is_possible: boolean
  price: number
}

// 카테고리
export type CategoryType = 'expense' | 'income'

export interface ICategory {
  expense: string
  income: string
}

export interface Custom {
  category: ICategory
  daily_result: string
  expected_limit: IExpectedLimit
  fixed_expense: IFixedExpense
}

// dropdown options
export interface Options {
  label: string
  value: string
}
