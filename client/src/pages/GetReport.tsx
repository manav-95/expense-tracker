import { ChevronDown, Download, Loader } from 'lucide-react'
import { useState, type FormEvent, useRef, useEffect } from 'react'
import { Audio } from 'react-loader-spinner'
import DoughnutChart from '../components/DoughnutChart'
import axios from 'axios'


const years = ['2026', '2027', '2028', '2029', '2030']
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

const GetReport = () => {

  const currMonth = new Date().toLocaleString('en-US', { month: 'long' })
  const currYear = new Date().getFullYear().toString()
  const printRef = useRef<HTMLDivElement>(null)

  const [activeYear, setActiveYear] = useState(currYear)
  const [activeMonth, setActiveMonth] = useState(currMonth)
  const [submittedYear, setSubmittedYear] = useState(currYear)
  const [submittedMonth, setSubmittedMonth] = useState(currMonth)
  const [activeList, setActiveList] = useState('')
  const [dropDownOpen, setDropDownOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showReport, setShowReport] = useState(false)
  const [transactionFilter, setTransactionFilter] = useState<'all' | 'income' | 'expense'>('all')
  const [isPrinting, setIsPrinting] = useState(false)
  const [reportData, setReportData] = useState<any>(null)
  const [initialLoadDone, setInitialLoadDone] = useState(false)

  const API_URL = import.meta.env.VITE_API_URL
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const userId = user._id

  const filteredTransactions = reportData?.transactions
    ? (transactionFilter === 'all'
      ? reportData.transactions
      : reportData.transactions.filter((t: any) => t.type === transactionFilter))
    : []

  const handleYearClick = (year: string) => {
    setActiveYear(year)
    setDropDownOpen(false)
    setActiveList('')
  }

  const handleMonthClick = (month: string) => {
    setActiveMonth(month)
    setDropDownOpen(false)
    setActiveList('')
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmittedYear(activeYear)
    setSubmittedMonth(activeMonth)
    await fetchReportData(activeYear, activeMonth)
  }

  const fetchReportData = async (year: string, month: string) => {
    setLoading(true)
    try {
      const response = await axios.post(`${API_URL}/transactions/monthly-report`, {
        year: parseInt(year),
        month: month.toLowerCase(),
        userId
      })

      if (response.data.success && response.data.reportData) {
        const data = response.data.reportData
        // Only show report if there's actual data (transactions or income/expense)
        if (data.transactions?.length > 0 || data.totalIncome > 0 || data.totalExpense > 0) {
          setReportData(data)
          setShowReport(true)
        } else {
          setReportData(null)
          setShowReport(false)
        }
      } else {
        setReportData(null)
        setShowReport(false)
      }
    } catch (error) {
      console.log('Error while fetching report: ', error)
      setReportData(null)
      setShowReport(false)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!initialLoadDone) {
      fetchReportData(currYear, currMonth)
      setInitialLoadDone(true)
    }
  }, [])

  const handleDownloadPDF = async () => {
    setIsPrinting(true)
    try {
      const html2pdf = (await import('html2pdf.js')).default

      if (printRef.current) {
        const element = printRef.current
        const opt = {
          margin: 10,
          filename: `${activeMonth}_${activeYear}_Report.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, allowTaint: true },
          jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
        }

        await html2pdf().set(opt).from(element).save()
        setIsPrinting(false)
      }
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Error generating PDF. Please try again.')
      setIsPrinting(false)
    }
  }

  const toggleDropdown = (type: string) => {
    if (activeList === type) {
      setDropDownOpen(!dropDownOpen)
    } else {
      setActiveList(type)
      setDropDownOpen(true)
    }
  }

  return (
    <div className=''>
      <form onSubmit={handleSubmit} className='my-3 grid grid-cols-1 sm:grid-cols-3 gap-2'>
        <div className='relative'>
          <button
            type='button'
            onClick={() => toggleDropdown('years')}
            className='relative w-full flex justify-between items-center gap-1 bg-white border px-3 py-2 rounded'
          >
            <span className='text-sm sm:text-base'>{activeYear}</span>
            <ChevronDown className={`${dropDownOpen && activeList === 'years' ? 'rotate-180' : 'rotate-0'} h-5 w-5 sm:h-6 sm:w-6 transition-all`} />
          </button>
          {dropDownOpen && activeList === 'years' && (
            <div className='absolute top-12 left-0 bg-white border w-full rounded p-1 z-20 shadow-lg'>
              {years.map((year, index) => (
                <li
                  onClick={() => handleYearClick(year)}
                  key={index}
                  className={`${activeYear === year ? 'bg-blue-400 text-white' : 'bg-white hover:bg-gray-100'} rounded list-none text-start px-3 py-2 cursor-pointer text-sm`}>
                  {year}
                </li>
              ))}
            </div>
          )}
        </div>

        <div className='relative'>
          <button
            type='button'
            onClick={() => toggleDropdown('months')}
            className='relative w-full flex justify-between items-center gap-1 bg-white border px-3 py-2 rounded'
          >
            <span className='text-sm sm:text-base'>{activeMonth}</span>
            <ChevronDown className={`${dropDownOpen && activeList === 'months' ? 'rotate-180' : 'rotate-0'} shrink-0 h-5 w-5 sm:h-6 sm:w-6 transition-all`} />
          </button>
          {dropDownOpen && activeList === 'months' && (
            <div className='absolute top-12 left-0 min-w-32 bg-white border w-full rounded p-1 z-20 shadow-lg max-h-48 overflow-y-auto'>
              {months.map((month, index) => (
                <li
                  onClick={() => handleMonthClick(month)}
                  key={index}
                  className={`${activeMonth === month ? 'bg-blue-400 text-white' : 'bg-white hover:bg-gray-100'} capitalize rounded list-none text-start px-3 py-2 cursor-pointer text-sm`}>
                  {month}
                </li>
              ))}
            </div>
          )}
        </div>

        <button
          type='submit'
          disabled={loading}
          className={`${loading ? 'bg-stone-200' : 'bg-green-500'} text-white rounded font-medium hover:opacity-90 transition-all py-2 text-sm sm:text-base`}>
          Get Report
        </button>
      </form>

      {loading ? (
        <div className='min-h-56 rounded flex justify-center items-center'>
          <Audio
            height="60"
            width="60"
            color="#ff5c5c"
            ariaLabel="audio-loading"
            wrapperStyle={{}}
            wrapperClass="wrapper-class"
            visible={true}
          />
        </div>
      ) : showReport && reportData ? (
        <div className='bg-white border border-gray-200 rounded p-4 sm:p-6 md:p-8 mb-6'>
          {/* Header */}
          <div className='flex flex-col sm:flex-row justify-between items-start gap-4 mb-6 sm:mb-8'>
            <div>
              <h1 className='text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800'>{submittedMonth} {submittedYear} Report</h1>
              <p className='text-gray-500 text-xs sm:text-sm mt-2'>Financial Summary & Analysis</p>
            </div>
            <button
              onClick={handleDownloadPDF}
              disabled={isPrinting}
              className={`flex items-center gap-2 ${isPrinting ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'} text-white px-3 sm:px-4 py-2 rounded font-medium transition-all text-sm w-full sm:w-auto justify-center sm:justify-start`}>
              {isPrinting ? (
                <>
                  <Loader size={18} className='animate-spin' />
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <Download size={18} />
                  <span>Download PDF</span>
                </>
              )}
            </button>
          </div>

          {/* Summary Cards */}
          <div className='grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8'>
            <div className='bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-3 sm:p-4'>
              <p className='text-gray-600 text-xs sm:text-sm font-medium'>Total Income</p>
              <p className='text-lg sm:text-xl md:text-2xl font-bold text-green-600 mt-1 sm:mt-2'>₹{(reportData?.totalIncome || 0).toLocaleString()}</p>
            </div>
            <div className='bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-lg p-3 sm:p-4'>
              <p className='text-gray-600 text-xs sm:text-sm font-medium'>Total Expense</p>
              <p className='text-lg sm:text-xl md:text-2xl font-bold text-red-600 mt-1 sm:mt-2'>₹{(reportData?.totalExpense || 0).toLocaleString()}</p>
            </div>
            <div className='bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-3 sm:p-4'>
              <p className='text-gray-600 text-xs sm:text-sm font-medium'>Total Savings</p>
              <p className='text-lg sm:text-xl md:text-2xl font-bold text-blue-600 mt-1 sm:mt-2'>₹{(reportData?.totalSavings || 0).toLocaleString()}</p>
            </div>
            <div className='bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-3 sm:p-4'>
              <p className='text-gray-600 text-xs sm:text-sm font-medium'>Savings %</p>
              <p className='text-lg sm:text-xl md:text-2xl font-bold text-purple-600 mt-1 sm:mt-2'>{reportData?.savingsPercent || 0}%</p>
            </div>
          </div>

          {/* Main Content */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8'>
            {/* Pie Chart */}
            <div className='bg-gray-50 border border-gray-200 rounded-lg p-4 sm:p-6'>
              <h2 className='text-base sm:text-lg font-bold text-gray-800 mb-4 sm:mb-6'>Expense Breakdown</h2>
              {reportData?.categoryBreakdown && reportData.categoryBreakdown.length > 0 ? (
                <DoughnutChart
                  data={reportData.categoryBreakdown.map((cat: any) => cat.amount)}
                  labels={reportData.categoryBreakdown.map((cat: any) => cat.name)}
                />
              ) : (
                <p className='text-gray-500 text-center py-8'>No expense data available</p>
              )}
            </div>

            {/* Details */}
            <div>
              <div className='bg-gray-50 border border-gray-200 rounded-lg p-4 sm:p-6'>
                <h2 className='text-base sm:text-lg font-bold text-gray-800 mb-4'>Key Metrics</h2>

                <div className='space-y-3 sm:space-y-4'>
                  <div className='pb-3 sm:pb-4 border-b border-gray-300'>
                    <p className='text-gray-600 text-xs sm:text-sm font-medium mb-1'>Total Transactions</p>
                    <p className='text-xl sm:text-2xl font-bold text-gray-800'>{reportData?.totalTransactions || 0}</p>
                  </div>

                  <div className='pb-3 sm:pb-4 border-b border-gray-300'>
                    <p className='text-gray-600 text-xs sm:text-sm font-medium mb-1'>Highest Spending Category</p>
                    <p className='text-xl sm:text-2xl font-bold text-red-600'>{reportData?.highestCategory || 'N/A'}</p>
                    <p className='text-lg sm:text-xl font-bold text-gray-800 mt-1'>₹{(reportData?.highestCategoryAmount || 0).toLocaleString()}</p>
                  </div>

                  <div>
                    <p className='text-gray-600 text-xs sm:text-sm font-medium mb-1'>Most Expensive Day</p>
                    <p className='text-xl sm:text-2xl font-bold text-gray-800'>{reportData?.mostExpensiveDay || 'N/A'}</p>
                    <p className='text-lg sm:text-xl font-bold text-red-600 mt-1'>₹{(reportData?.mostExpensiveDayAmount || 0).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Category Breakdown Table */}
          <div className='bg-gray-50 border border-gray-200 rounded-lg p-4 sm:p-6 mb-6'>
            <h2 className='text-base sm:text-lg font-bold text-gray-800 mb-4'>Category Breakdown</h2>
            <div className='overflow-x-auto'>
              <table className='w-full text-sm sm:text-base'>
                <thead>
                  <tr className='border-b border-gray-300'>
                    <th className='text-left py-2 sm:py-3 px-2 sm:px-4 font-semibold text-gray-700'>Category</th>
                    <th className='text-right py-2 sm:py-3 px-2 sm:px-4 font-semibold text-gray-700'>Amount</th>
                    <th className='text-right py-2 sm:py-3 px-2 sm:px-4 font-semibold text-gray-700'>Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData?.categoryBreakdown && reportData.categoryBreakdown.length > 0 ? (
                    reportData.categoryBreakdown.map((cat: any, idx: number) => (
                      <tr key={idx} className='border-b border-gray-200 hover:bg-gray-100'>
                        <td className='py-2 sm:py-3 px-2 sm:px-4 text-gray-800'>{cat.name}</td>
                        <td className='text-right py-2 sm:py-3 px-2 sm:px-4 text-gray-800 font-semibold'>₹{(cat.amount || 0).toLocaleString()}</td>
                        <td className='text-right py-2 sm:py-3 px-2 sm:px-4'>
                          <div className='flex items-center justify-end gap-1 sm:gap-2'>
                            <div className='w-12 sm:w-16 bg-gray-300 rounded h-2'>
                              <div className='bg-blue-500 rounded h-2' style={{ width: `${cat.percentage || 0}%` }}></div>
                            </div>
                            <span className='text-xs sm:text-sm font-semibold text-gray-600 whitespace-nowrap'>{(cat.percentage || 0).toFixed(1)}%</span>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className='py-4 text-center text-gray-500'>No data available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Transactions Table */}
          <div className='bg-gray-50 border border-gray-200 rounded-lg p-4 sm:p-6 mb-6'>
            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4'>
              <h2 className='text-base sm:text-lg font-bold text-gray-800'>All Transactions</h2>
              <select
                value={transactionFilter}
                onChange={(e) => setTransactionFilter(e.target.value as 'all' | 'income' | 'expense')}
                className='px-3 py-1 border border-gray-300 rounded text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500'
              >
                <option value='all'>All</option>
                <option value='income'>Income</option>
                <option value='expense'>Expense</option>
              </select>
            </div>
            <div className='overflow-x-auto'>
              <table className='w-full text-sm'>
                <thead className='bg-white border-b border-gray-300'>
                  <tr>
                    <th className='px-3 py-2 text-left font-semibold text-gray-700 whitespace-nowrap w-8'>Sr</th>
                    <th className='px-3 py-2 text-left font-semibold text-gray-700 whitespace-nowrap'>Type</th>
                    <th className='px-3 py-2 text-left font-semibold text-gray-700 whitespace-nowrap'>Category</th>
                    <th className='px-3 py-2 text-left font-semibold text-gray-700 whitespace-nowrap'>Mode</th>
                    <th className='px-3 py-2 text-right font-semibold text-gray-700 whitespace-nowrap'>Amount</th>
                    <th className='px-3 py-2 text-left font-semibold text-gray-700 whitespace-nowrap'>Date</th>
                    <th className='px-3 py-2 text-left font-semibold text-gray-700 w-64'>Note</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions && filteredTransactions.length > 0 ? (
                    filteredTransactions.map((transaction: any, index: number) => (
                      <tr key={transaction._id || index} className='border-b border-gray-200 hover:bg-white'>
                        <td className='px-3 py-2 text-gray-800 whitespace-nowrap'>{index + 1}</td>
                        <td className='px-3 py-2 whitespace-nowrap'>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${transaction.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                            {transaction.type === 'income' ? 'Income' : 'Expense'}
                          </span>
                        </td>
                        <td className='px-3 py-2 text-gray-800 whitespace-nowrap'>{transaction.category || 'N/A'}</td>
                        <td className='px-3 py-2 text-gray-800 whitespace-nowrap capitalize'>{transaction.paymentMode || 'N/A'}</td>
                        <td className={`px-3 py-2 text-right font-semibold whitespace-nowrap ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                          }`}>
                          {transaction.type === 'income' ? '+' : '-'}₹{(parseInt(transaction.amount) || 0).toLocaleString()}
                        </td>
                        <td className='px-3 py-2 text-gray-800 whitespace-nowrap'>{new Date(transaction.date).toLocaleDateString('en-IN')}</td>
                        <td className='px-3 py-2 text-gray-800 min-w-40'>{transaction.note || '-'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className='py-4 text-center text-gray-500'>No transactions found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer */}
          <div className='mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-300 text-center'>
            <p className='text-xs sm:text-sm text-gray-500'>Report Generated on {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      ) : (
        <div className='min-h-56 bg-white border border-gray-200 rounded flex justify-center items-center p-4'>
          <span className='capitalize text-gray-600 text-center text-sm sm:text-base'>No Report found for {submittedYear}, {submittedMonth}</span>
        </div>
      )}

      {/* Printable Content - Hidden */}
      <div style={{ display: 'none' }}>
        {reportData && (
          <div ref={printRef} style={{ fontFamily: 'Arial, sans-serif', padding: '40px', backgroundColor: '#f8f9fa' }}>
            {/* Header */}
            <div style={{
              backgroundColor: '#ffffff',
              padding: '30px',
              borderRadius: '12px',
              marginBottom: '30px',
              textAlign: 'center',
              borderLeft: '5px solid #3b82f6',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              pageBreakAfter: 'avoid',
              pageBreakInside: 'avoid'
            }}>
              <h1 style={{ textAlign: 'center', margin: '0 0 10px 0', fontSize: '32px', fontWeight: 'bold', color: '#1f2937' }}>
                {submittedMonth} {submittedYear}
              </h1>
              <p style={{ margin: '0', fontSize: '14px', color: '#6b7280' }}>Financial Report</p>
            </div>

            {/* Financial Summary */}
            <div style={{ pageBreakInside: 'avoid', pageBreakAfter: 'avoid', marginBottom: '30px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', color: '#1f2937', marginTop: '30px' }}>Financial Summary</h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '20px'
              }}>
                <div style={{
                  backgroundColor: '#f0fdf4',
                  border: '2px solid #22c55e',
                  borderRadius: '8px',
                  padding: '20px'
                }}>
                  <p style={{ margin: '0 0 10px 0', fontSize: '13px', color: '#6b7280', fontWeight: '600' }}>Total Income</p>
                  <p style={{ margin: '0', fontSize: '24px', fontWeight: 'bold', color: '#16a34a' }}>₹{(reportData?.totalIncome || 0).toLocaleString()}</p>
                </div>
                <div style={{
                  backgroundColor: '#fef2f2',
                  border: '2px solid #ef4444',
                  borderRadius: '8px',
                  padding: '20px'
                }}>
                  <p style={{ margin: '0 0 10px 0', fontSize: '13px', color: '#6b7280', fontWeight: '600' }}>Total Expense</p>
                  <p style={{ margin: '0', fontSize: '24px', fontWeight: 'bold', color: '#dc2626' }}>₹{(reportData?.totalExpense || 0).toLocaleString()}</p>
                </div>
                <div style={{
                  backgroundColor: '#eff6ff',
                  border: '2px solid #3b82f6',
                  borderRadius: '8px',
                  padding: '20px'
                }}>
                  <p style={{ margin: '0 0 10px 0', fontSize: '13px', color: '#6b7280', fontWeight: '600' }}>Total Savings</p>
                  <p style={{ margin: '0', fontSize: '24px', fontWeight: 'bold', color: '#2563eb' }}>₹{(reportData?.totalSavings || 0).toLocaleString()}</p>
                </div>
                <div style={{
                  backgroundColor: '#faf5ff',
                  border: '2px solid #a855f7',
                  borderRadius: '8px',
                  padding: '20px'
                }}>
                  <p style={{ margin: '0 0 10px 0', fontSize: '13px', color: '#6b7280', fontWeight: '600' }}>Savings %</p>
                  <p style={{ margin: '0', fontSize: '24px', fontWeight: 'bold', color: '#7c3aed' }}>{reportData?.savingsPercent || 0}%</p>
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div style={{ pageBreakInside: 'avoid', pageBreakAfter: 'avoid', marginBottom: '30px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', color: '#1f2937', marginTop: '30px' }}>Key Metrics</h2>
              <div style={{
                backgroundColor: '#ffffff',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                padding: '20px'
              }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '12px 15px', fontWeight: '600', color: '#374151' }}>Total Transactions</td>
                      <td style={{ padding: '12px 15px', textAlign: 'right', fontWeight: 'bold', color: '#1f2937' }}>{reportData?.totalTransactions || 0}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
                      <td style={{ padding: '12px 15px', fontWeight: '600', color: '#374151' }}>Highest Spending Category</td>
                      <td style={{ padding: '12px 15px', textAlign: 'right', fontWeight: 'bold', color: '#dc2626' }}>{reportData?.highestCategory || 'N/A'}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '12px 15px', fontWeight: '600', color: '#374151' }}>Category Amount</td>
                      <td style={{ padding: '12px 15px', textAlign: 'right', fontWeight: 'bold', color: '#1f2937' }}>₹{(reportData?.highestCategoryAmount || 0).toLocaleString()}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
                      <td style={{ padding: '12px 15px', fontWeight: '600', color: '#374151' }}>Most Expensive Day</td>
                      <td style={{ padding: '12px 15px', textAlign: 'right', fontWeight: 'bold', color: '#1f2937' }}>{reportData?.mostExpensiveDay || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '12px 15px', fontWeight: '600', color: '#374151' }}>Day Amount</td>
                      <td style={{ padding: '12px 15px', textAlign: 'right', fontWeight: 'bold', color: '#dc2626' }}>₹{(reportData?.mostExpensiveDayAmount || 0).toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Category Breakdown */}
            <div style={{ pageBreakInside: 'avoid', pageBreakAfter: 'avoid', marginBottom: '30px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', color: '#1f2937', marginTop: '30px' }}>Category Breakdown</h2>
              <div style={{
                backgroundColor: '#ffffff',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                padding: '20px',
                overflow: 'auto'
              }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f3f4f6', borderBottom: '2px solid #d1d5db' }}>
                      <th style={{ padding: '12px 15px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Category</th>
                      <th style={{ padding: '12px 15px', textAlign: 'right', fontWeight: '600', color: '#374151' }}>Amount</th>
                      <th style={{ padding: '12px 15px', textAlign: 'right', fontWeight: '600', color: '#374151' }}>Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData?.categoryBreakdown && reportData.categoryBreakdown.length > 0 ? (
                      reportData.categoryBreakdown.map((cat: any, idx: number) => (
                        <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                          <td style={{ padding: '12px 15px', color: '#374151' }}>{cat.name}</td>
                          <td style={{ padding: '12px 15px', textAlign: 'right', color: '#1f2937', fontWeight: '600' }}>₹{(cat.amount || 0).toLocaleString()}</td>
                          <td style={{ padding: '12px 15px', textAlign: 'right', color: '#2563eb', fontWeight: '600' }}>{(cat.percentage || 0).toFixed(1)}%</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} style={{ padding: '12px 15px', textAlign: 'center', color: '#6b7280' }}>No data available</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Transactions */}
            <div style={{ pageBreakInside: 'avoid', marginBottom: '30px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', color: '#1f2937', marginTop: '30px' }}>All Transactions</h2>
              <div style={{
                backgroundColor: '#ffffff',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                padding: '20px',
                overflow: 'auto'
              }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f3f4f6', borderBottom: '2px solid #d1d5db' }}>
                      <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: '600', color: '#374151', width: '5%' }}>Sr</th>
                      <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: '600', color: '#374151', width: '10%' }}>Type</th>
                      <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: '600', color: '#374151', width: '12%' }}>Category</th>
                      <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: '600', color: '#374151', width: '10%' }}>Mode</th>
                      <th style={{ padding: '10px 12px', textAlign: 'right', fontWeight: '600', color: '#374151', width: '12%' }}>Amount</th>
                      <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: '600', color: '#374151', width: '12%' }}>Date</th>
                      <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: '600', color: '#374151', width: '39%' }}>Note</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData?.transactions && reportData.transactions.length > 0 ? (
                      reportData.transactions.map((t: any, idx: number) => (
                        <tr key={t._id || idx} style={{ backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f9fafb', borderBottom: '1px solid #e5e7eb', pageBreakInside: 'avoid' }}>
                          <td style={{ padding: '10px 12px', color: '#374151' }}>{idx + 1}</td>
                          <td style={{ padding: '10px 12px', color: t.type === 'income' ? '#16a34a' : '#dc2626', fontWeight: '600' }}>
                            {t.type === 'income' ? 'Income' : 'Expense'}
                          </td>
                          <td style={{ padding: '10px 12px', color: '#374151' }}>{t.category || 'N/A'}</td>
                          <td style={{ padding: '10px 12px', color: '#374151', textTransform: 'capitalize' }}>{t.paymentMode || 'N/A'}</td>
                          <td style={{ padding: '10px 12px', textAlign: 'right', color: t.type === 'income' ? '#16a34a' : '#dc2626', fontWeight: '600' }}>
                            {t.type === 'income' ? '+' : '-'}₹{(parseInt(t.amount) || 0).toLocaleString()}
                          </td>
                          <td style={{ padding: '10px 12px', color: '#374151' }}>{new Date(t.date).toLocaleDateString('en-IN')}</td>
                          <td style={{ padding: '10px 12px', color: '#374151', wordWrap: 'break-word' }}>{t.note || '-'}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} style={{ padding: '10px 12px', textAlign: 'center', color: '#6b7280' }}>No transactions found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer */}
            <div style={{
              textAlign: 'center',
              paddingTop: '20px',
              borderTop: '2px solid #e5e7eb',
              color: '#6b7280',
              fontSize: '12px',
              marginTop: '40px',
              pageBreakAfter: 'avoid',
              pageBreakInside: 'avoid'
            }}>
              <p>Report Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}</p>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media print {
          div[style*="pageBreakInside"] {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          div[style*="pageBreakAfter"] {
            page-break-after: avoid !important;
            break-after: avoid !important;
          }
          table {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          tr {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          thead {
            display: table-header-group;
          }
        }
      `}</style>
    </div>
  )
}

export default GetReport
