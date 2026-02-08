import { useEffect, type ReactNode, useState, type Dispatch, type SetStateAction } from 'react'

import { TransactionContext } from '../hooks/useTransactionHook'
import axios from 'axios';

type Transaction = {
    amount: number;
    category: string;
    paymentMode: string;
    date: Date;
    type: string;
    note: string;
}

export type TransactionContextType = {
    transactions: Transaction[] | [];
    setTransactions: Dispatch<SetStateAction<Transaction[] | []>>;
    refetch: () => Promise<void>;
}

type TransactionContextProps = {
    children: ReactNode
}

export const TransactionContextProvider = ({ children }: TransactionContextProps) => {
    const [transactions, setTransactions] = useState<Transaction[] | []>([])

    const API_URL = import.meta.env.VITE_API_URL;
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const userId = user._id

    const getUserTransactions = async () => {
        try {
            const response = await axios.get(`${API_URL}/transactions/${userId}`)
            if (response) {
                setTransactions(response?.data?.transactions || [])
            }
        } catch (error) {
            setTransactions([])
            console.log('Error Fetching User Transactions', error)
        }
    }

    const refetch = async () => {
        await getUserTransactions()
    }

    useEffect(() => {
        getUserTransactions();
    }, [])

    return (
        <TransactionContext.Provider value={{
            transactions,
            setTransactions,
            refetch,
        }}>
            {children}
        </TransactionContext.Provider>

    )
}
