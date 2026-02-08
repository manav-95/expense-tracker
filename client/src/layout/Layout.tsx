import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'

const Layout = () => {
    return (
        <div className='flex flex-col bg-slate-50 h-screen'>
            <div className='fixed top-0 right-0 w-full z-50 bg-white shadow/5'>
                <Navbar />
            </div>
            <div className='mt-16 p-4'>
                <Outlet />
            </div>
        </div>
    )
}

export default Layout
