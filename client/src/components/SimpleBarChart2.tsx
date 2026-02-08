import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

import { useAnalysis } from '../hooks/useAnalysisHook';


// #endregion
const SimpleBarChart2 = () => {

  const { vsAnalysisData } = useAnalysis()

  const chartWidth = Math.max(vsAnalysisData.length * 60, 600)

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '600px',
        overflowX: 'auto',
        overflowY: 'hidden'
      }}
    >
      <BarChart
        width={chartWidth}
        height={350}
        data={vsAnalysisData}
        margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
        responsive
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" fontSize={12} />
        <YAxis width={40} fontSize={12} />
        <Tooltip contentStyle={{ fontSize: 14 }} />
        <Bar dataKey="expense" fill="#8884d8" activeBar={{ fill: 'red', stroke: 'orange' }} radius={[0, 0, 0, 0]} />
      </BarChart>
    </div>
  );
};

export default SimpleBarChart2;