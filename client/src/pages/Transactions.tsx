import { useState } from "react";
import IncomeExpenseModal from "../components/IncomeExpenseModal";
import axios from "axios";
import { useTransaction } from '../hooks/useTransactionHook'

interface FormData {
  amount: string;
  category: string;
  paymentMode: string;
  date: string;
  note: string;
}

interface Transaction extends FormData {
  id: number;
  type: "income" | "expense";
}

const Transactions = () => {

  const { transactions, refetch } = useTransaction()
  const API_URL = import.meta.env.VITE_API_URL
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const userId = user._id

  const [openModal, setOpenModal] = useState<"income" | "expense" | null>(null);
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">(
    "all"
  );
  const [loading, setLoading] = useState(false);

  const handleAddIncome = () => {
    setOpenModal("income");
  };

  const handleAddExpense = () => {
    setOpenModal("expense");
  };

  const handleCloseModal = () => {
    setOpenModal(null);
  };

  const handleSubmitForm = async (data: FormData) => {
    setLoading(true);
    try {
      const endpoint = openModal === "income" ? "add-income" : "add-expense";
      
      const response = await axios.post(`${API_URL}/transactions/${endpoint}`, {
        amount: parseInt(data.amount),
        category: data.category,
        paymentMode: data.paymentMode,
        date: data.date,
        type: openModal,
        note: data.note,
        userId: userId
      });

      if (response.data.success) {
        console.log(`${openModal === "income" ? "Income" : "Expense"} added successfully:`, data);
        setOpenModal(null);
        // Refetch transactions to update UI
        await refetch();
      }
    } catch (error) {
      console.error("Error submitting transaction:", error);
      alert("Failed to add transaction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions =
    filterType === "all"
      ? transactions
      : transactions.filter((t) => t.type === filterType);

  return (
    <div className="p-4">
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button
          onClick={handleAddIncome}
          disabled={loading}
          className="bg-green-500 hover:bg-green-600 text-white w-full text-center font-medium py-2 px-4 rounded-lg transition disabled:opacity-50"
        >
          Add Income
        </button>
        <button
          onClick={handleAddExpense}
          disabled={loading}
          className="bg-red-500 hover:bg-red-600 text-white w-full text-center font-medium py-2 px-4 rounded-lg transition disabled:opacity-50"
        >
          Add Expense
        </button>
      </div>

      <IncomeExpenseModal
        type={openModal === "income" ? "income" : "expense"}
        isOpen={openModal !== null}
        onClose={handleCloseModal}
        onSubmit={handleSubmitForm}
      />

      {/* Transactions List Placeholder */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Recent Transactions
          </h2>
          <select
            value={filterType}
            onChange={(e) =>
              setFilterType(e.target.value as "all" | "income" | "expense")
            }
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="all">All</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        {filteredTransactions.length === 0 ? (
          <div className="text-center text-gray-500 py-8 bg-gray-50 rounded-lg">
            No transactions yet. Add your first income or expense!
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full" style={{ tableLayout: 'auto' }}>
              <thead className="bg-gray-100 border-b border-gray-200 sticky top-0">
                <tr style={{ pageBreakInside: 'avoid' }}>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 whitespace-nowrap w-12">
                    Sr.No
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 whitespace-nowrap w-24">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 whitespace-nowrap w-28">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 whitespace-nowrap w-28">
                    Payment Mode
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 whitespace-nowrap w-24">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 whitespace-nowrap w-24">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 w-48">
                    Note
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction, index) => (
                  <tr
                    key={transaction?._id}
                    className="border-b border-gray-200 hover:bg-gray-50 transition"
                    style={{ pageBreakInside: 'avoid' }}
                  >
                    <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3 text-sm whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${transaction.type === "income"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                          }`}
                      >
                        {transaction.type.charAt(0).toUpperCase() +
                          transaction.type.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                      {transaction.category}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                      {transaction.paymentMode.charAt(0).toUpperCase() +
                        transaction.paymentMode.slice(1)}
                    </td>
                    <td
                      className={`px-4 py-3 text-sm font-semibold whitespace-nowrap ${transaction.type === "income"
                        ? "text-green-600"
                        : "text-red-600"
                        }`}
                    >
                      {transaction.type === "income" ? "+" : "-"}₹
                      {transaction.amount}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                      {new Date(transaction.date).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 min-w-64">
                      {transaction.note || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style>{`
        @media print {
          tr {
            page-break-inside: avoid;
            break-inside: avoid;
          }
          thead {
            page-break-after: avoid;
            break-after: avoid;
          }
        }
      `}</style>
    </div>
  );
};

export default Transactions;
