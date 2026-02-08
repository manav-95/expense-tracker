import express from 'express'
import { addIncome, addExpense, getAllTransactions, Analysis, monthlyReport } from '../controllers/transaction.controller.js'

import { authMiddleware } from '../middlewares/auth.middleware.js'

const router = express.Router();

router.post('/add-income', addIncome);
router.post('/add-expense', addExpense);
router.get('/:id', getAllTransactions)

router.get('/analysis/:id', Analysis)

router.post('/monthly-report', monthlyReport)

export default router;