import React from 'react'
import DashboardCards from '../components/DashboardCards'
import DoughnutChart from '../components/DoughnutChart'
import SimpleBarChart from '../components/SimpleBarChart'
import SimpleBarChart2 from '../components/SimpleBarChart2'
import SimpleLineChart from '../components/SimpleLineChart'

import { useAnalysis } from '../hooks/useAnalysisHook'
import { useTransaction } from '../hooks/useTransactionHook'

const Dashboard = () => {
    const { currYearSummary, currYearCategorySummary } = useAnalysis()
    const { transactions } = useTransaction();
   

    // Get current date in dd-jan-yyyy format
    const getCurrentDate = () => {
        const date = new Date()
        const day = String(date.getDate()).padStart(2, '0')
        const month = date.toLocaleString('en-US', { month: 'short' }).toLowerCase()
        const year = date.getFullYear()
        return `${day}-${month}-${year}`
    }

    const date = new Date();
    const currYear = date.getFullYear()
    const currMonth = date.toLocaleString('en-US', { month: 'short' })


    const financialTips = [
        { icon: '💰', title: 'Budget Tracking', description: 'Keep track of your spending to stay within budget' },
        { icon: '📊', title: 'Save More', description: 'Try to save at least 20% of your monthly income' },
        { icon: '🎯', title: 'Set Goals', description: 'Set financial goals and monitor your progress' },
        { icon: '📱', title: 'Use Reports', description: 'Check monthly reports to analyze spending patterns' },
    ]

    return (
        <div>
            {/* Current Date */}
            <div className='flex items-center justify-between mb-5'>
                <div className='flex justify-between items-center w-full'>
                    <h1 className='text-3xl font-bold text-gray-800'>Dashboard</h1>
                    <p className='text-sm text-gray-500 mt-1'>{getCurrentDate()}</p>
                </div>
            </div>

            <DashboardCards totalIncome={currYearSummary?.totalIncome || 0} totalExpense={currYearSummary?.totalExpense || 0} totalSaving={currYearSummary?.totalSaving || 0} />
            <div className='my-5'>
                <h1 className='text-2xl font-medium mb-5'>Spending Analytics</h1>
                <div className='md:grid md:grid-cols-2 md:gap-4'>
                    <div className='bg-white border-gray-200 border-2 p-4 rounded-2xl'>
                        <div className='flex justify-between items-center'>
                            <h1 className='mb-3 font-medium capitalize'>Daily Expenses Trend</h1>
                            <h1 className='mb-3 font-medium capitalize'>{currMonth} {currYear}</h1>
                        </div>
                        <SimpleLineChart />
                    </div>
                    <div className='bg-white border-gray-200 border-2 p-4 rounded-2xl mt-5'>
                        <h1 className='mb-3 font-medium capitalize'>Spending by category</h1>
                        {currYearCategorySummary ? (
                            <DoughnutChart labels={Object.keys(currYearCategorySummary || [])} data={Object.values(currYearCategorySummary || [])} />
                        ) : (
                            <DoughnutChart labels={['demo1', 'demo2']} data={[10, 20]} />
                        )
                        }
                    </div>
                    <div className='bg-white border-gray-200 border-2 p-4 rounded-2xl mt-5'>
                        <h1 className='mb-3 font-medium capitalize'>Income vs Expense vs Saving</h1>
                        <SimpleBarChart />
                    </div>
                    <div className='bg-white border-gray-200 border-2 p-4 rounded-2xl mt-5'>
                        <h1 className='mb-3 font-medium capitalize'>Monthly Expense Comparison</h1>
                        <SimpleBarChart2 />
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            {/* <div className='my-8'>
                <h1 className='text-2xl font-medium mb-5'>Quick Stats</h1>
                <div className='grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4'>
                    <div className='bg-blue-50 border-2 border-blue-200 p-4 rounded-lg'>
                        <p className='text-gray-600 text-sm font-medium'>Avg. Daily Spend</p>
                        <p className='text-xl md:text-2xl font-bold text-blue-600 mt-2'>₹107</p>
                    </div>
                    <div className='bg-orange-50 border-2 border-orange-200 p-4 rounded-lg'>
                        <p className='text-gray-600 text-sm font-medium'>Highest Expense</p>
                        <p className='text-xl md:text-2xl font-bold text-orange-600 mt-2'>₹3000</p>
                    </div>
                    <div className='bg-purple-50 border-2 border-purple-200 p-4 rounded-lg'>
                        <p className='text-gray-600 text-sm font-medium'>This Month</p>
                        <p className='text-xl md:text-2xl font-bold text-purple-600 mt-2'>4 Trans.</p>
                    </div>
                    <div className='bg-pink-50 border-2 border-pink-200 p-4 rounded-lg'>
                        <p className='text-gray-600 text-sm font-medium'>Balance Status</p>
                        <p className='text-xl md:text-2xl font-bold text-pink-600 mt-2'>Positive</p>
                    </div>
                </div>
            </div> */}

            {/* Recent Transactions */}
            <div className='my-8'>
                <div className='flex justify-between items-center mb-5'>
                    <h1 className='text-2xl font-medium'>Recent Transactions</h1>
                    <a href='/transactions' className='text-blue-500 hover:text-blue-600 font-medium text-sm'>View All</a>
                </div>
                <div className='space-y-3'>
                    {transactions.slice(0, 4).map((transaction) => (
                        <div key={transaction?._id} className='flex justify-between items-center bg-white border border-gray-200 p-4 rounded-lg hover:shadow-md transition'>
                            <div className='flex items-center gap-4 flex-1'>
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                                    }`}>
                                    <span className={`text-xl ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                        {transaction.type === 'income' ? '📈' : '📉'}
                                    </span>
                                </div>
                                <div className='flex-1'>
                                    <p className='font-medium text-gray-800'>{transaction.category}</p>
                                    <p className='text-sm text-gray-500'>{new Date(transaction.date).toLocaleDateString('en-IN', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                    })}</p>
                                </div>
                            </div>
                            <p className={`text-lg font-bold whitespace-nowrap ml-4 ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                                }`}>
                                {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Financial Tips */}
            <div className='my-8 mb-12'>
                <h1 className='text-2xl font-medium mb-5'>💡 Financial Tips</h1>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                    {financialTips.map((tip, index) => (
                        <div key={index} className='bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 p-6 rounded-lg hover:shadow-md transition'>
                            <p className='text-3xl mb-3'>{tip.icon}</p>
                            <h3 className='font-bold text-gray-800 mb-2'>{tip.title}</h3>
                            <p className='text-sm text-gray-600 leading-relaxed'>{tip.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Dashboard
