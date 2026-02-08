import axios from 'axios';
import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

import { useAnalysis } from '../hooks/useAnalysisHook'

const SimpleBarChart = () => {
  const { vsAnalysisData, setVsAnalysisData, setCurrYearSummary, setCurrYearCategorySummary, setDailyExpensesTrend } = useAnalysis()
  const API_URL = import.meta.env.VITE_API_URL;

  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const userId = user._id


  React.useEffect(() => {
    const getVsAnalysis = async () => {
      try {
        const response = await axios.get(`${API_URL}/transactions/analysis/${userId}`)
        if (response) {
          setVsAnalysisData(response?.data?.result || []);
          setCurrYearSummary(response?.data?.currYearSummary || null)
          setCurrYearCategorySummary(response?.data?.currYearCategorySummary || null)
          setDailyExpensesTrend(response?.data?.dailyExpensesTrend || [])
        }
      } catch (error) {
        setVsAnalysisData([])
        setCurrYearSummary(null)
        setCurrYearCategorySummary(null)
        setDailyExpensesTrend([])
        console.log("Error While Getting Vs Analysis: ", error)
      }
    }

    getVsAnalysis();
  }, [])

  const chartWidth = Math.max(vsAnalysisData.length * 85, 600)

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
        <Bar dataKey="income" fill="#eab308" radius={[0, 0, 0, 0]} />
        <Bar dataKey="expense" fill="#ef4444" radius={[0, 0, 0, 0]} />
        <Bar dataKey="saving" fill="#22c55e" radius={[0, 0, 0, 0]} />
        <Tooltip contentStyle={{ fontSize: 14 }} />

      </BarChart>
    </div>
  );
};

export default SimpleBarChart;