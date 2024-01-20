import { styled } from 'styled-components'
import FixedExpense from './FixedExpense'
import ExpectedLimit from './ExpectedLimit'
import MonthlyFinancialOverview from './MonthlyFinancialOverview'
import useCustom from '../../hooks/custom/useCustom'
import { initialCustom } from '../../constants/config'

const Container = styled.section`
  display: flex;
  flex-direction: column;

  width: 300px;
  background-color: ${({ theme }) => theme.color.white2};
`

const Title = styled.p`
  font-size: ${({ theme }) => theme.fontSize.lg};
  font-weight: ${({ theme }) => theme.fontWeight.extraBold};
  text-align: center;
  margin: 0;
  padding: 1.5rem 1.5rem 0;
`

const SubContainer = styled.div`
  section:first-child {
    margin-bottom: 1rem;
  }
`

const Sidebar = () => {
  const { custom } = useCustom()
  const expenseCategory =
    localStorage.getItem('category_expense') || initialCustom.category.expense

  return (
    <Container>
      <Title>월간 가계부</Title>
      <FixedExpense
        fixedExpense={custom?.fixed_expense || initialCustom.fixed_expense}
        category={expenseCategory}
        enableExpectedLimit={
          custom?.expected_limit.is_possible ||
          initialCustom.expected_limit.is_possible
        }
      />
      <SubContainer>
        <ExpectedLimit
          expectedLimit={custom?.expected_limit || initialCustom.expected_limit}
        />
        <MonthlyFinancialOverview />
      </SubContainer>
    </Container>
  )
}

export default Sidebar
