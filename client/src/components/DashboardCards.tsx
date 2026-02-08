import { TrendingUp, TrendingDown, PiggyBank } from 'lucide-react';

interface DashboardCardsProps {
  totalIncome: number;
  totalExpense: number;
  totalSaving: number;
}

const DashboardCards = ({
  totalIncome,
  totalExpense,
  totalSaving,
}: DashboardCardsProps) =>  {
  const savingsPercentage = totalIncome > 0 ? ((totalSaving / totalIncome) * 100).toFixed(1) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
      {/* Income Card */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-600 text-sm font-medium">Total Income</p>
            <p className="text-3xl font-bold text-emerald-600 mt-2">₹{totalIncome}</p>
          </div>
          <div className="bg-emerald-100 p-3 rounded-lg">
            <TrendingUp className="w-6 h-6 text-emerald-600" />
          </div>
        </div>
      </div>

      {/* Expenses Card */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-600 text-sm font-medium">Total Expenses</p>
            <p className="text-3xl font-bold text-red-600 mt-2">₹{totalExpense}</p>
          </div>
          <div className="bg-red-100 p-3 rounded-lg">
            <TrendingDown className="w-6 h-6 text-red-600" />
          </div>
        </div>
      </div>

      {/* Savings Card */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-600 text-sm font-medium">Total Savings</p>
            <p className="text-3xl font-bold text-teal-600 mt-2">₹{totalSaving}</p>
            <p className="text-xs text-slate-500 mt-1">{savingsPercentage}% of income</p>
          </div>
          <div className="bg-teal-100 p-3 rounded-lg">
            <PiggyBank className="w-6 h-6 text-teal-600" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardCards;