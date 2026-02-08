import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

import { useAnalysis } from '../hooks/useAnalysisHook'

export default function SimpleLineChart() {

  const { dailyExpensesTrend } = useAnalysis()

  const dailyExpensesTrendArr = Object.entries(dailyExpensesTrend).map(
    ([date, amount]) => ({
      date,
      amount
    })
  )

  const chartWidth = Math.max(dailyExpensesTrendArr.length * 100, 400)


  if (dailyExpensesTrendArr.length === 0) {
    return <p>No data available</p>
  }

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '600px',
        overflowX: 'auto',
        overflowY: 'hidden'
      }}
    >
      <LineChart
        width={chartWidth}
        height={350}
        data={dailyExpensesTrendArr}
        margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
        responsive
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" fontSize={12} padding={{ left: 0, right: 0 }} />
        <YAxis width={40} fontSize={12} />
        <Tooltip />
        <Line type="monotone" dataKey="amount" stroke="#8884d8" activeDot={{ r: 8 }} />
      </LineChart>
    </div>
  );
}