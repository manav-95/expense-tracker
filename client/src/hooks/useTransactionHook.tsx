import React from 'react'
import { type TransactionContextType } from '../contexts/TransactionContext'

export const TransactionContext = React.createContext<TransactionContextType | undefined>(undefined);


export const useTransaction = () => {
    const context = React.useContext(TransactionContext);
    if (!context) {
        throw new Error('useTransactionContext must be used within a TransactionContextProvider');
    }
    return context;
}