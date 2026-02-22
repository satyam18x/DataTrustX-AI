import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, ArrowRight, Handshake } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Button from './ui/Button';

const Navbar = () => {
    const { isAuthenticated, logout, user } = useContext(AuthContext);
    const { isDark, toggleTheme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navLinks = [
        { name: 'Marketplace', path: '/#features' },
        { name: 'About', path: '/#about' },
        { name: 'Pricing', path: '/#pricing' },
    ];

    const isAuthPage = ['/login', '/register'].includes(location.pathname);

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${scrolled
                ? 'bg-white/80 dark:bg-surface-900/80 backdrop-blur-md shadow-lg border-b border-gray-200 dark:border-surface-700 py-3'
                : 'bg-transparent py-5'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2 group">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-lg shadow-blue-500/30">
                            <Handshake className="text-white w-6 h-6" />
                        </div>
                        <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
                            DataTrustX
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    {!isAuthenticated ? (
                        <div className="hidden md:flex items-center space-x-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className="text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="h-6 w-px bg-gray-200 dark:bg-surface-300 mx-2"></div>
                            <button
                                onClick={toggleTheme}
                                className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-surface-700 rounded-xl transition-colors"
                            >
                                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                            </button>
                            {!isAuthPage && (
                                <>
                                    <Link to="/login" className="text-sm font-bold text-gray-900 dark:text-white hover:text-blue-600 transition-colors">
                                        Sign In
                                    </Link>
                                    <Link to="/register">
                                        <Button variant="primary" size="sm" className="px-6 rounded-full">
                                            Get Started
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="hidden md:flex items-center space-x-6">
                            <button
                                onClick={toggleTheme}
                                className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-surface-700 rounded-xl transition-colors"
                            >
                                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                            </button>
                            <Link to="/dashboard">
                                <Button variant="primary" size="sm" className="rounded-full flex items-center">
                                    Go to Dashboard <ArrowRight className="ml-2 w-4 h-4" />
                                </Button>
                            </Link>
                        </div>
                    )}

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center space-x-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-surface-700 rounded-lg"
                        >
                            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-surface-700"
                        >
                            {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Sidebar */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 right-0 w-80 bg-white dark:bg-surface-900/50 z-50 shadow-2xl p-8 flex flex-col"
                        >
                            <div className="flex justify-between items-center mb-10">
                                <span className="text-xl font-bold text-gray-900 dark:text-white">Menu</span>
                                <button onClick={() => setIsOpen(false)} className="text-gray-500">
                                    <X className="w-7 h-7" />
                                </button>
                            </div>

                            <nav className="flex-1 space-y-6">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        to={link.path}
                                        onClick={() => setIsOpen(false)}
                                        className="block text-2xl font-bold text-gray-900 dark:text-white hover:text-blue-600 transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                            </nav>

                            <div className="pt-8 border-t border-gray-100 dark:border-surface-700 flex flex-col space-y-4">
                                {!isAuthenticated ? (
                                    <>
                                        <Link to="/login" onClick={() => setIsOpen(false)}>
                                            <Button variant="secondary" className="w-full">Sign In</Button>
                                        </Link>
                                        <Link to="/register" onClick={() => setIsOpen(false)}>
                                            <Button variant="primary" className="w-full">Get Started</Button>
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                                            <Button variant="primary" className="w-full">Go to Dashboard</Button>
                                        </Link>
                                        <Button variant="ghost" onClick={handleLogout} className="text-red-500">Sign Out</Button>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
