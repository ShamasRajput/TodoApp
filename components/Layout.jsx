import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Layout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const router = useRouter();

    const linkClasses = (path) => {
        return router.pathname === path
            ? 'block py-2 px-4 bg-black text-white rounded-xl w-full'
            : 'block py-2 px-4 rounded-xl hover:bg-gray-300 hover:text-black w-full';
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-br from-yellow-100 to-yellow-500">
            {/* Mobile Header */}
            <div className="lg:hidden flex justify-between items-center bg-white p-4 shadow-lg">
                <div className="flex items-center">
                    <Link href='/'><img src='/favicon.ico' alt='Todo App Logo' className='w-8 h-8' /></Link>
                    <h1 className="ml-2 text-xl font-bold">Todo App</h1>
                </div>
                <button onClick={toggleSidebar} className="text-gray-800">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>

            {/* Sidebar */}
            <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-full lg:w-64 bg-white text-gray-800 flex flex-col shadow-lg transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-200 ease-in-out`}>
                <div className="p-4">
                    <a href='/'><img src='/favicon.ico' alt='Todo App Logo' className='w-8 h-8' /></a>
                </div>
                <nav className="flex-1 p-4 space-y-3 flex flex-col justify-center">
                    <Link href="/">
                        <span className={linkClasses('/')}>Dashboard</span>
                    </Link>
                    <Link href="/completed">
                        <span className={linkClasses('/completed')}>Completed Tasks</span>
                    </Link>
                    <Link href="/pending">
                        <span className={linkClasses('/pending')}>Pending Tasks</span>
                    </Link>
                </nav>
                <div className="p-4 mt-auto">Profile</div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col p-8">
                {children}
            </main>
        </div>
    );
};

export default Layout;
