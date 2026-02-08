import React from 'react';
import { AnalysisContext } from '../hooks/useAnalysisHook'

type Analysis = {
    month: string;
    income: number;
    expense: number;
    saving: number;
}

type currentYearSummary = {
    totalIncome: number;
    totalExpense: number;
    totalSaving: number;
}

type dailyExpensesTrendType = {
    date: string;
    amount: number;
}

export type AnalysisContextType = {
    vsAnalysisData: Analysis[] | [];
    setVsAnalysisData: React.Dispatch<React.SetStateAction<Analysis[] | []>>
    currYearSummary: currentYearSummary | null;
    setCurrYearSummary: React.Dispatch<React.SetStateAction<currentYearSummary | null>>;
    currYearCategorySummary: null;
    setCurrYearCategorySummary: React.Dispatch<React.SetStateAction<null>>;
    dailyExpensesTrend: dailyExpensesTrendType[] | [];
    setDailyExpensesTrend: React.Dispatch<React.SetStateAction<dailyExpensesTrendType[] | []>>;
}


type AnalysisContextProviderProps = {
    children: React.ReactNode;
};


export const AnalysisContextProvider = ({ children }: AnalysisContextProviderProps) => {
    const [vsAnalysisData, setVsAnalysisData] = React.useState<Analysis[] | []>([])
    const [currYearSummary, setCurrYearSummary] = React.useState<currentYearSummary | null>(null)
    const [currYearCategorySummary, setCurrYearCategorySummary] = React.useState(null)
    const [dailyExpensesTrend, setDailyExpensesTrend] = React.useState<dailyExpensesTrendType[] | []>([])
    return (
        <AnalysisContext.Provider value={{
            vsAnalysisData,
            setVsAnalysisData,
            currYearSummary,
            setCurrYearSummary,
            currYearCategorySummary,
            setCurrYearCategorySummary,
            dailyExpensesTrend,
            setDailyExpensesTrend,
        }}>
            {children}
        </AnalysisContext.Provider>
    )
};

