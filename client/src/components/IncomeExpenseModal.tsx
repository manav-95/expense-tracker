import { X } from "lucide-react";
import { useState } from "react";

interface ModalProps {
  type: "income" | "expense";
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
}

interface FormData {
  amount: string;
  category: string;
  paymentMode: string;
  date: string;
  note: string;
}

const incomeCategories = [
  "Salary",
  "Freelance",
  "Investment",
  "Bonus",
  "Other Income",
];

const expenseCategories = [
  "Food",
  "Transport",
  "Entertainment",
  "Utilities",
  "Shopping",
  "Healthcare",
  "Other Expense",
];

const IncomeExpenseModal: React.FC<ModalProps> = ({
  type,
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<FormData>({
    amount: "",
    category: "",
    paymentMode: "cash",
    date: new Date().toISOString().split("T")[0],
    note: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories =
    type === "income" ? incomeCategories : expenseCategories;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    }

    if (!formData.category) {
      newErrors.category = "Please select a category";
    }

    if (!formData.date) {
      newErrors.date = "Please select a date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
      // Reset form after successful submission
      setFormData({
        amount: "",
        category: "",
        paymentMode: "cash",
        date: new Date().toISOString().split("T")[0],
        note: "",
      });
      setErrors({});
      onClose();
    }
  };

  if (!isOpen) return null;

  const isIncome = type === "income";
  const title = isIncome ? "Add Income" : "Add Expense";
  const buttonColor = isIncome ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600";

  return (
    <div className="fixed inset-0 bg-black/30 z-50 p-4 flex justify-center items-start pt-10">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="font-semibold text-xl text-gray-800">{title}</h1>
          <button
            onClick={onClose}
            className="bg-red-500 text-white rounded p-1 hover:bg-red-600 transition"
          >
            <X size={20} />
          </button>
        </div>

        <hr className="border border-gray-200 mb-4" />

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Amount */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
              Amount *
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              placeholder="Enter amount"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.amount && (
              <p className="text-red-500 text-xs mt-1">{errors.amount}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-500 text-xs mt-1">{errors.category}</p>
            )}
          </div>

          {/* Payment Mode */}
          <div>
            <label htmlFor="paymentMode" className="block text-sm font-medium text-gray-700 mb-1">
              Payment Mode
            </label>
            <select
              id="paymentMode"
              name="paymentMode"
              value={formData.paymentMode}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="cash">Cash</option>
              <option value="upi">UPI</option>
            </select>
          </div>

          {/* Date */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Date *
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.date && (
              <p className="text-red-500 text-xs mt-1">{errors.date}</p>
            )}
          </div>

          {/* Note */}
          <div>
            <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-1">
              Note (Optional)
            </label>
            <textarea
              id="note"
              name="note"
              value={formData.note}
              onChange={handleInputChange}
              placeholder="Add any notes..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`flex-1 px-4 py-2 ${buttonColor} text-white rounded-lg font-medium transition`}
            >
              {isIncome ? "Add Income" : "Add Expense"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IncomeExpenseModal;
