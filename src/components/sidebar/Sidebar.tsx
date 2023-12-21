import { styled } from 'styled-components'
import FixedExpense from './FixedExpense'
import ExpectedLimit from './ExpectedLimit'
import { useQuery } from '@tanstack/react-query'
import MonthlyFinancialOverview from './MonthlyFinancialOverview'
import { getCustom } from '../../api/firebase'

const Container = styled.aside`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 300px;
  background-color: #f6f6f6;
  padding: 1rem;
  height: calc(100vh - 70px);
  overflow-y: auto;

  section {
    border: 1px solid #c2c2c2;
    padding: 1rem;
  }

  section:first-child {
    height: 70%;
  }
`

const Sidebar = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['custom'],
    queryFn: () => getCustom(),
  })

  // 로딩 스피너 추후 변경
  if (!data || isLoading) return <div>Loading...</div>

  return (
    <Container>
      <FixedExpense fixedExpense={data.fixed_expense} />
      <ExpectedLimit expectedLimit={data.expected_limit} />
      <MonthlyFinancialOverview custom={data.daily_result} />
    </Container>
  )
}

export default Sidebar
