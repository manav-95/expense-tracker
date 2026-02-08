import React from 'react'
import { type AuthContextType } from '../contexts/AuthContext'

export const AuthContext = React.createContext<AuthContextType | undefined>(undefined);


export const useAuth = () => {
    const context = React.useContext(AuthContext);
    if (!context) {
        throw new Error('useAuthContext must be used within a AuthContextProvider');
    }
    return context;
}