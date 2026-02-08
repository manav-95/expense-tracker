import React from 'react'
import { type AnalysisContextType } from '../contexts/AnalysisContext'

export const AnalysisContext = React.createContext<AnalysisContextType | undefined>(undefined);


export const useAnalysis = () => {
    const context = React.useContext(AnalysisContext);
    if (!context) {
        throw new Error('useAnalysisContext must be used within a AnalysisContextProvider');
    }
    return context;
}