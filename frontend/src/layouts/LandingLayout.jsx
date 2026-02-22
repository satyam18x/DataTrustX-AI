import React from 'react';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';

const LandingLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-white dark:bg-surface-900">
            <Navbar />
            <motion.main
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="flex-grow pt-16"
            >
                {children}
            </motion.main>

            {/* Footer */}
            <footer className="bg-gray-50 dark:bg-surface-800 border-t border-gray-200 dark:border-surface-200 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="col-span-2">
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                                DataTrustX
                            </span>
                            <p className="mt-4 text-gray-500 dark:text-gray-400 max-w-xs">
                                The most trusted marketplace for high-quality, ML-verified datasets. Empowering data scientists and organizations globally.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Product</h4>
                            <ul className="mt-4 space-y-2">
                                <li><a href="#" className="text-sm text-gray-500 hover:text-blue-600 dark:hover:text-blue-400">Features</a></li>
                                <li><a href="#" className="text-sm text-gray-500 hover:text-blue-600 dark:hover:text-blue-400">Marketplace</a></li>
                                <li><a href="#" className="text-sm text-gray-500 hover:text-blue-600 dark:hover:text-blue-400">Pricing</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Legal</h4>
                            <ul className="mt-4 space-y-2">
                                <li><a href="#" className="text-sm text-gray-500 hover:text-blue-600 dark:hover:text-blue-400">Privacy</a></li>
                                <li><a href="#" className="text-sm text-gray-500 hover:text-blue-600 dark:hover:text-blue-400">Terms</a></li>
                                <li><a href="#" className="text-sm text-gray-500 hover:text-blue-600 dark:hover:text-blue-400">Policy</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-12 pt-8 border-t border-gray-200 dark:border-surface-200 flex flex-col md:flex-row justify-between items-center">
                        <p className="text-sm text-gray-400 dark:text-gray-500">
                            &copy; 2026 DataTrustX AI Platform. All rights reserved.
                        </p>
                        <div className="flex space-x-6 mt-4 md:mt-0">
                            <a href="#" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                                Twitter
                            </a>
                            <a href="#" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                                GitHub
                            </a>
                            <a href="#" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                                LinkedIn
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingLayout;
