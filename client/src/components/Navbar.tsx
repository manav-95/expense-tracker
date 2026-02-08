import axios from "axios"
import { LayoutDashboard, BookText, ArrowLeftRight, LogOutIcon, MenuIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"

import { useAuth } from '../hooks/useAuthHook'

const Navbar = () => {

    const [menu, setMenu] = useState(false)
    const navigate = useNavigate();

    const { setLoggedIn, setUser } = useAuth()

    const links = [
        { name: 'dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'get report', path: '/get-report', icon: BookText },
        { name: 'transactions', path: '/transactions', icon: ArrowLeftRight },
    ]

    const API_URL = import.meta.env.VITE_API_URL;

    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const userName = user.name

    const handleLogout = async () => {
        try {
            const response = await axios.post(`${API_URL}/users/logout`)
            if (response) {
                setLoggedIn(false)
                setUser(null)
                localStorage.removeItem('user')
                navigate('/login')
            }
        } catch (error) {
            console.log("Error While Logout: ", error)
        }
    }

    return (
        <>
            <div className="relative flex justify-between items-center px-4 py-3 border-b-2 border-gray-200">
                <div className="flex justify-center items-center space-x-2">
                    <img
                        src="/image.png"
                        alt="logo"
                        className="h-8 w-8 filter hue-rotate-90"
                    />
                    <h1 className="text-xl font-medium">Bond & Budgets</h1>
                </div>
                <div className="flex justify-center items-center gap-2">
                    <button className="h-10 w-10 flex justify-center items-center bg-purple-500/70 border-2 border-purple-600 rounded-full">
                        <span className="text-xl font-semibold text-white uppercase">{userName.charAt(0)}</span>
                    </button>
                    <button onClick={() => { setMenu(true) }} >
                        <MenuIcon className="h-8 w-8" />
                    </button>
                </div>
                {menu && (
                    <div onClick={() => setMenu(false)} className="absolute inset-0 h-screen">
                        <div className="absolute right-2 top-14 min-w-7/12 text-sm bg-white border-2 border-gray-100 p-2 rounded">
                            {links.map((link, index) => {
                                const Icon = link.icon;
                                return (
                                    <>
                                        <NavLink
                                            to={link.path}
                                            key={index}
                                            onClick={() => setMenu(false)}
                                            className={({ isActive }) =>
                                                `flex items-center gap-2 px-2 py-2 rounded capitalize
                                             ${isActive ? "bg-red-100 text-red-500" : "text-gray-700"}`
                                            }>
                                            <Icon className="h-4 w-4 mr-2" />
                                            <span>{link.name}</span>
                                        </NavLink>

                                    </>
                                )
                            })}
                            <div className="my-2 border-gray-400 border-t" />
                            <button
                                onClick={() => {
                                    setMenu(false);
                                    handleLogout();
                                }}
                                className="w-full flex justify-start items-center p-2 bg-gray-50 rounded"
                            >
                                <LogOutIcon className="h-4 w-4 mr-2" />
                                <span className="text-sm capitalize">logout</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>

        </>
    )
}

export default Navbar
