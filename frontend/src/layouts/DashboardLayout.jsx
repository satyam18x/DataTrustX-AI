import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Handshake,
    History,
    ShieldAlert as AdminIcon,
    LogOut,
    Menu,
    X,
    User as UserIcon,
    ChevronRight,
    Search,
    Bell,
    Moon,
    Sun
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Button from '../components/ui/Button';

const DashboardLayout = ({ children }) => {
    const { user, logout } = useContext(AuthContext);
    const { isDark, toggleTheme } = useTheme();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'My Deals', path: '/deals', icon: Handshake, roles: ['buyer', 'seller'] },
        { name: 'History', path: '/history', icon: History, roles: ['buyer', 'seller'] },
        { name: 'Admin Panel', path: '/admin', icon: AdminIcon, roles: ['admin'] },
    ];

    const filteredNavItems = navItems.filter(item =>
        !item.roles || (user && item.roles.includes(user.role))
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-surface-900 flex overflow-hidden">
            {/* Desktop Sidebar */}
            <motion.aside
                initial={false}
                animate={{ width: isSidebarOpen ? '260px' : '84px' }}
                className="hidden lg:flex flex-col bg-white dark:bg-surface-900 border-r border-gray-200 dark:border-surface-700 z-30"
            >
                <div className="p-6 flex items-center justify-between">
                    <AnimatePresence mode="wait">
                        {isSidebarOpen ? (
                            <motion.div
                                key="logo-full"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center space-x-2"
                            >
                                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                    <Handshake className="text-white w-5 h-5 text-indigo-100" />
                                </div>
                                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                                    DataTrustX
                                </span>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="logo-short"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mx-auto"
                            >
                                <Handshake className="text-white w-6 h-6" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-2">
                    {filteredNavItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${location.pathname === item.path
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-surface-700 hover:text-gray-900 dark:hover:text-white'
                                }`}
                        >
                            <item.icon className={`w-5 h-5 ${isSidebarOpen ? 'mr-4' : 'mx-auto'}`} />
                            {isSidebarOpen && (
                                <motion.span
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                >
                                    {item.name}
                                </motion.span>
                            )}
                            {isSidebarOpen && location.pathname === item.path && (
                                <ChevronRight className="w-4 h-4 ml-auto" />
                            )}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-200 dark:border-surface-700">
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors group"
                    >
                        <LogOut className={`w-5 h-5 ${isSidebarOpen ? 'mr-4' : 'mx-auto'}`} />
                        {isSidebarOpen && <span>Sign Out</span>}
                    </button>

                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="hidden lg:flex mt-4 items-center justify-center w-full p-2 border border-gray-200 dark:border-surface-700 rounded-lg hover:bg-gray-50 dark:hover:bg-surface-900 transition-colors"
                    >
                        {isSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                    </button>
                </div>
            </motion.aside>

            {/* Mobile Sidebar (Overlay) */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                        />
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            className="fixed inset-y-0 left-0 w-72 bg-white dark:bg-surface-900 z-50 lg:hidden shadow-2xl"
                        >
                            <div className="p-6 flex items-center justify-between">
                                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                                    DataTrustX
                                </span>
                                <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <nav className="px-4 py-2 space-y-2">
                                {filteredNavItems.map((item) => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`flex items-center px-4 py-3 rounded-xl ${location.pathname === item.path
                                            ? 'bg-blue-600 text-white'
                                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-surface-700'
                                            }`}
                                    >
                                        <item.icon className="w-5 h-5 mr-4" />
                                        <span>{item.name}</span>
                                    </Link>
                                ))}
                            </nav>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                {/* Top Header */}
                <header className="h-16 flex items-center justify-between px-6 bg-white/80 dark:bg-surface-900/80 backdrop-blur-md border-b border-gray-200 dark:border-surface-700 sticky top-0 z-20">
                    <div className="flex items-center">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-surface-700 rounded-lg mr-2"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <div className="hidden sm:flex items-center px-3 py-1.5 bg-gray-100 dark:bg-surface-700 rounded-lg w-64 lg:w-96 group">
                            <Search className="w-4 h-4 text-gray-400 group-focus-within:text-blue-500" />
                            <input
                                type="text"
                                placeholder="Search everything..."
                                className="ml-2 bg-transparent border-none focus:ring-0 text-sm w-full text-gray-900 dark:text-white"
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-2 sm:space-x-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
                            aria-label="Toggle theme"
                        >
                            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>
                        <button className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-surface-700 rounded-lg relative transition-colors">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-surface-900"></span>
                        </button>
                        <div className="h-8 w-px bg-gray-200 dark:border-surface-700 hidden sm:block mx-2"></div>
                        <div className="flex items-center space-x-3 cursor-pointer p-1.5 hover:bg-gray-100 dark:hover:bg-surface-700 rounded-lg transition-colors">
                            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center border-2 border-white dark:border-surface-900 shadow-sm">
                                <UserIcon className="w-5 h-5 text-white" />
                            </div>
                            <div className="hidden md:block">
                                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate max-w-[120px]">
                                    {user?.username}
                                </p>
                                <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-widest font-bold">
                                    {user?.role}
                                </p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        {children}
                    </motion.div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
