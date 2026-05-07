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
    ChevronDown,
    Settings,
    HelpCircle
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import Button from '../components/ui/Button';

const DashboardLayout = ({ children }) => {
    const { user, logout } = useContext(AuthContext);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Verified Deals', path: '/deals', icon: Handshake, roles: ['buyer', 'seller'] },
        { name: 'Activity Log', path: '/history', icon: History, roles: ['buyer', 'seller'] },
        { name: 'Admin Console', path: '/admin', icon: AdminIcon, roles: ['admin'] },
    ];

    const filteredNavItems = navItems.filter(item =>
        !item.roles || (user && item.roles.includes(user.role))
    );

    return (
        <div className="min-h-screen bg-[#F8F9FC] flex overflow-hidden font-sans selection:bg-indigo-100 selection:text-indigo-900">
            {/* Desktop Sidebar */}
            <motion.aside
                initial={false}
                animate={{ width: isSidebarOpen ? '280px' : '88px' }}
                className="hidden lg:flex flex-col bg-white border-r border-neutral-200/60 z-30 shadow-sm shadow-neutral-100"
            >
                <div className="h-20 px-6 flex items-center justify-between border-b border-neutral-50/50">
                    <Link to="/" className="flex items-center space-x-3 group outline-none">
                        <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                            <Handshake className="text-white w-5 h-5" strokeWidth={2.5} />
                        </div>

                        {isSidebarOpen && (
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-lg font-bold tracking-tight text-neutral-900"
                            >
                                DataTrustX <span className="text-indigo-600">AI</span>
                            </motion.span>
                        )}
                    </Link>
                </div>

                <div className="flex-1 px-4 py-8 space-y-1.5 overflow-y-auto">
                    {filteredNavItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 group relative ${isActive
                                    ? 'bg-indigo-50 text-indigo-700 font-bold'
                                    : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900'
                                    }`}

                            >
                                <item.icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-indigo-600' : 'text-neutral-400 group-hover:text-neutral-600'}`} />
                                {isSidebarOpen && (
                                    <motion.span
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="ml-3.5 text-[14px]"
                                    >
                                        {item.name}
                                    </motion.span>
                                )}
                                {isActive && !isSidebarOpen && (
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-600 rounded-l-full" />
                                )}
                                {isActive && isSidebarOpen && (
                                    <ChevronRight className="w-4 h-4 ml-auto text-indigo-400" />
                                )}
                            </Link>
                        );
                    })}
                </div>

                <div className="p-4 border-t border-neutral-100 space-y-2">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="flex items-center w-full px-4 py-3 text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900 rounded-xl transition-colors group"
                    >
                        <Settings className="w-5 h-5 shrink-0" />
                        {isSidebarOpen && <span className="ml-3.5 text-[14px] font-medium">Settings</span>}
                    </button>
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors group"
                    >
                        <LogOut className="w-5 h-5 shrink-0" />
                        {isSidebarOpen && <span className="ml-3.5 text-[14px] font-bold">Sign Out</span>}
                    </button>
                </div>
            </motion.aside>

            {/* Mobile Header */}
            <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-neutral-100 z-40 flex items-center justify-between px-6">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                        <Handshake className="text-white w-4 h-4" />
                    </div>
                    <span className="font-bold text-neutral-900 tracking-tight">DataTrustX <span className="text-indigo-600">AI</span></span>

                </div>
                <button
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="p-2 text-neutral-500 hover:bg-neutral-50 rounded-lg"
                >
                    <Menu className="w-6 h-6" />
                </button>
            </header>

            {/* Mobile Sidebar */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-50 lg:hidden"
                        />
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 w-80 bg-white z-50 lg:hidden shadow-2xl flex flex-col"
                        >
                            <div className="p-6 flex items-center justify-between border-b border-neutral-50">
                                <span className="text-xl font-bold text-neutral-900">Console</span>
                                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-neutral-400">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <nav className="flex-1 px-4 py-8 space-y-2">
                                {filteredNavItems.map((item) => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`flex items-center px-4 py-4 rounded-2xl ${location.pathname === item.path
                                            ? 'bg-indigo-50 text-indigo-700 font-bold'
                                            : 'text-neutral-600 hover:bg-neutral-50'
                                            }`}

                                    >
                                        <item.icon className="w-6 h-6 mr-4" />
                                        <span className="text-lg">{item.name}</span>
                                    </Link>
                                ))}
                            </nav>
                            <div className="p-8 border-t border-neutral-50">
                                <Button variant="secondary" onClick={handleLogout} className="w-full text-red-500 font-bold">Sign Out</Button>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative pt-16 lg:pt-0">
                {/* Desktop Top Header */}
                <header className="hidden lg:flex h-20 items-center justify-between px-10 bg-white/80 backdrop-blur-md border-b border-neutral-100/50 sticky top-0 z-20">
                    <div className="flex items-center w-full max-w-xl">
                        <div className="relative w-full group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-neutral-400 group-focus-within:text-indigo-500 transition-colors" strokeWidth={2.2} />
                            <input
                                type="text"
                                placeholder="Search analytics, deals, or records..."
                                className="w-full pl-11 pr-4 py-2.5 bg-neutral-50 border-transparent focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-500/5 rounded-2xl text-[14px] text-neutral-700 placeholder-neutral-400 transition-all outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-6 ml-8">
                        <button className="p-2.5 text-neutral-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl relative transition-all group">
                            <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                        </button>

                        <div className="h-6 w-px bg-neutral-200"></div>

                        <div className="relative">
                            <button
                                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                                className="flex items-center space-x-3 p-1.5 hover:bg-neutral-50 rounded-2xl transition-all"
                            >
                                <div className="w-9 h-9 bg-indigo-100 rounded-xl flex items-center justify-center border border-indigo-200 shadow-sm overflow-hidden">
                                    {user?.username ? (
                                        <span className="text-indigo-700 font-bold text-sm uppercase">{user.username.charAt(0)}</span>
                                    ) : (
                                        <UserIcon className="w-5 h-5 text-indigo-600" />
                                    )}
                                </div>
                                <div className="hidden xl:block text-left pr-2">
                                    <p className="text-[13px] font-bold text-neutral-900 leading-none">
                                        {user?.username}
                                    </p>
                                    <p className="text-[11px] text-neutral-400 font-semibold uppercase tracking-wider mt-1">
                                        {user?.role}
                                    </p>
                                </div>
                                <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {isProfileMenuOpen && (
                                    <>
                                        <div className="fixed inset-0 z-0" onClick={() => setIsProfileMenuOpen(false)} />
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute right-0 mt-3 w-56 bg-white border border-neutral-100 rounded-2xl shadow-dropdown p-2 z-10"
                                        >
                                            <div className="px-4 py-3 border-bottom border-neutral-50">
                                                <p className="text-[12px] font-bold text-neutral-400 uppercase tracking-widest leading-none mb-1">Signed in as</p>
                                                <p className="text-[14px] font-bold text-neutral-900 truncate">{user?.username || 'User'}</p>
                                            </div>
                                            <div className="h-px bg-neutral-50 my-2"></div>
                                            <button className="flex items-center w-full px-4 py-2.5 text-[14px] text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 rounded-xl transition-colors">
                                                <UserIcon className="w-4 h-4 mr-3" /> Profile Settings
                                            </button>
                                            <button className="flex items-center w-full px-4 py-2.5 text-[14px] text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 rounded-xl transition-colors">
                                                <HelpCircle className="w-4 h-4 mr-3" /> Support Center
                                            </button>
                                            <div className="h-px bg-neutral-50 my-2"></div>
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center w-full px-4 py-2.5 text-[14px] text-red-500 font-bold hover:bg-red-50 rounded-xl transition-colors"
                                            >
                                                <LogOut className="w-4 h-4 mr-3" /> Sign Out
                                            </button>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 lg:p-10">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="max-w-[1600px] mx-auto"
                    >
                        {children}
                    </motion.div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;

