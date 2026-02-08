import Transaction from '../models/Transaction.js'

import { formatDate } from '../utils/formatDate.js'

const monthMap = {
    'january': 0,
    'february': 1,
    'march': 2,
    'april': 3,
    'may': 4,
    'june': 5,
    'july': 6,
    'august': 7,
    'september': 8,
    'october': 9,
    'november': 10,
    'december': 11
}

export const addIncome = async (req, res) => {
    try {
        const { amount, category, paymentMode, date, type, note, userId } = req.body
        if (!amount || !category || !paymentMode || !date || !type || !userId) return res.status(400).json({ success: false, message: "All Fields Required" })

        const income = new Transaction({
            amount: amount,
            category: category,
            paymentMode: paymentMode,
            date: date,
            type: type,
            note: note,
            user: userId
        })

        await income.save();

        return res.status(201).json({ success: true, message: "Income Added Successfully" })
    } catch (error) {
        console.log("Error While Adding Income: ", error.message)
        return res.status(500).json({ message: "Internal Server Error", error: error.message })
    }
}



export const addExpense = async (req, res) => {
    try {
        const { amount, category, paymentMode, date, type, note, userId } = req.body
        if (!amount || !category || !paymentMode || !date || !type || !userId) return res.status(400).json({ success: false, message: "All Fields Required" })

        const expense = new Transaction({
            amount: amount,
            category: category,
            paymentMode: paymentMode,
            date: date,
            type: type,
            note: note,
            user: userId
        })

        await expense.save();

        return res.status(201).json({ success: true, message: "Expense Added Successfully" })
    } catch (error) {
        console.log("Error While Adding Expense: ", error.message)
        return res.status(500).json({ message: "Internal Server Error", error: error.message })
    }
}


export const getAllTransactions = async (req, res) => {
    try {
        const userId = req.params.id
        const transactions = await Transaction.find({ user: userId }).sort({ date: -1 })
        if (transactions.length !== 0) {
            return res.status(200).json({ success: true, message: "Transactions Found Successfully", transactions })
        } else {
            return res.status(404).json({ success: true, message: "No Transactions Found For This User" })
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message })

    }
}

export const monthlyReport = async (req, res) => {
    try {
        const { year, month, userId } = req.body

        if (!year || !month || !userId) {
            return res.status(400).json({ message: "All Fields Are Required" })
        }

        const monthIndex = monthMap[month.toLowerCase()]
        if (monthIndex === undefined) {
            return res.status(400).json({ message: "Invalid month" })
        }

        // Date range for given month
        const startDate = new Date(year, monthIndex, 1)
        const endDate = new Date(year, monthIndex + 1, 0, 23, 59, 59)

        const transactions = await Transaction.find({
            user: userId,
            date: { $gte: startDate, $lte: endDate }
        }).sort({ date: -1 })

        let totalIncome = 0
        let totalExpense = 0
        let categoryBreakdown = {}
        let dailyExpense = {}

        transactions.forEach(txn => {
            if (txn.type === "income") {
                totalIncome += txn.amount
            }

            if (txn.type === "expense") {
                totalExpense += txn.amount

                // Category breakdown
                categoryBreakdown[txn.category] =
                    (categoryBreakdown[txn.category] || 0) + txn.amount

                // Daily expense
                const day = txn.date.toISOString().split("T")[0]
                dailyExpense[day] = (dailyExpense[day] || 0) + txn.amount
            }
        })

        // Highest category
        let highestCategory = null
        let highestCategoryAmount = 0

        for (const cat in categoryBreakdown) {
            if (categoryBreakdown[cat] > highestCategoryAmount) {
                highestCategoryAmount = categoryBreakdown[cat]
                highestCategory = cat
            }
        }

        // Most expensive day
        let mostExpensiveDay = null
        let mostExpensiveDayAmount = 0

        for (const day in dailyExpense) {
            if (dailyExpense[day] > mostExpensiveDayAmount) {
                mostExpensiveDayAmount = dailyExpense[day]
                mostExpensiveDay = day
            }
        }

        const totalSavings = totalIncome - totalExpense
        const savingsPercent =
            totalIncome > 0
                ? Math.round((totalSavings / totalIncome) * 100)
                : 0

        // Convert categoryBreakdown object to array format
        const categoryBreakdownArray = Object.entries(categoryBreakdown).map(([name, amount]) => ({
            name,
            amount,
            percentage: totalExpense > 0 ? (amount / totalExpense) * 100 : 0
        }))

        const reportData = {
            totalIncome,
            totalExpense,
            totalSavings,
            savingsPercent,
            totalTransactions: transactions.length,
            highestCategory,
            highestCategoryAmount,
            mostExpensiveDay,
            mostExpensiveDayAmount,
            categoryBreakdown: categoryBreakdownArray,
            transactions
        }

        return res.status(200).json({
            success: true,
            message: "Monthly Report Generated",
            reportData
        })

    } catch (error) {
        console.error("Monthly Report Error:", error)
        return res.status(500).json({ message: "Internal Server Error" })
    }
}



export const Analysis = async (req, res) => {
    try {
        const userId = req.params.id

        const transactions = await Transaction.find({ user: userId })
        if (transactions.length === 0) return res.status(200).json(({ success: true, message: "No Transactions Found For This User" }))

        const now = new Date()
        const currMonth = now.getMonth()
        const currYear = now.getFullYear()

        const monthsArr = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']

        const initialState = monthsArr.map(m => (
            {
                month: m,
                income: 0,
                expense: 0,
                saving: 0
            }
        ))

        const result = transactions.reduce((acc, txn) => {

            const date = new Date(txn.date)
            if (date.getFullYear() !== currYear) return acc;

            const monthIndex = date.getMonth();

            if (txn.type === 'income') {
                acc[monthIndex].income += txn.amount
            } else if (txn.type === 'expense') {
                acc[monthIndex].expense += txn.amount
            }

            acc[monthIndex].saving = acc[monthIndex].income - acc[monthIndex].expense
            return acc
        }, initialState)

        const currYearSummary = result.reduce(
            (acc, t) => {
                acc.totalIncome += t.income
                acc.totalExpense += t.expense
                acc.totalSaving = acc.totalIncome - acc.totalExpense
                return acc
            },
            { totalIncome: 0, totalExpense: 0, totalSaving: 0 }
        )


        const currYearCategorySummary = transactions.reduce((acc, txn) => {

            const date = new Date(txn.date)

            if (date.getFullYear() !== currYear) return acc;

            if (txn.type !== 'expense') return acc;

            // initialize category if not exists
            if (!acc[txn.category]) {
                acc[txn.category] = 0
            }

            acc[txn.category] += txn.amount

            return acc;
        }, {})


        const dailyExpensesTrend = transactions.reduce((acc, txn) => {
            const txnDate = new Date(txn.date)

            if (txn.type !== 'expense') return acc;
            if (txnDate.getMonth() !== currMonth) return acc;
            if (txnDate.getFullYear() !== currYear) return acc

            const formattedDate = formatDate(txnDate)

            if (!acc[formattedDate]) acc[formattedDate] = 0
            acc[formattedDate] += txn.amount

            return acc;
        }, {})


        return res.status(200).json({
            success: true,
            message: "Result Analysis Successfully",
            result,
            currYearSummary,
            currYearCategorySummary,
            dailyExpensesTrend,
        })

    } catch (error) {
        console.log("Error Getting Analysis: ", error.message)
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}
