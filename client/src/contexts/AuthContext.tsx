import { type ReactNode, useState, type Dispatch, type SetStateAction, useEffect } from 'react'

import { AuthContext } from '../hooks/useAuthHook'

type User = {
    _id: string;
    name: string;
    email: string;
}

export type AuthContextType = {
    loggedIn: boolean;
    setLoggedIn: Dispatch<SetStateAction<boolean>>
    user: User | null;
    setUser: Dispatch<SetStateAction<User | null>>
}

type AuthContextProps = {
    children: ReactNode
}

export const AuthContextProvider = ({ children }: AuthContextProps) => {
    const [loggedIn, setLoggedIn] = useState<boolean>(false)
    const [user, setUser] = useState<User | null>(null)

    return (
        <AuthContext.Provider value={{
            loggedIn,
            setLoggedIn,
            user,
            setUser,
        }}>
            {children}
        </AuthContext.Provider>

    )
}
