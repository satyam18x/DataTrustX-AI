import React from 'react';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { Handshake } from 'lucide-react';

const LandingLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-white selection:bg-indigo-100 selection:text-indigo-900">
            <Navbar />
            <motion.main
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="flex-grow pt-24"
            >
                {children}
            </motion.main>

            {/* Footer */}
            <footer className="bg-neutral-50 border-t border-neutral-100 py-20">
                <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-12">
                        <div className="col-span-2">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                                    <Handshake className="text-white w-4 h-4" strokeWidth={2.5} />
                                </div>
                                <span className="text-xl font-bold tracking-tight text-neutral-900">
                                    DataTrustX <span className="text-indigo-600">AI</span>
                                </span>
                            </div>
                            <p className="text-neutral-500 text-[15px] max-w-sm leading-relaxed">
                                The enterprise-grade marketplace for ML-verified datasets.
                                Secure, transparent, and built for the future of AI.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-[13px] font-bold text-neutral-900 uppercase tracking-widest mb-6">Product</h4>
                            <ul className="space-y-4">
                                <li><a href="#" className="text-[14px] text-neutral-500 hover:text-indigo-600 transition-colors">Marketplace</a></li>
                                <li><a href="#" className="text-[14px] text-neutral-500 hover:text-indigo-600 transition-colors">Verification</a></li>
                                <li><a href="#" className="text-[14px] text-neutral-500 hover:text-indigo-600 transition-colors">Pricing</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-[13px] font-bold text-neutral-900 uppercase tracking-widest mb-6">Resources</h4>
                            <ul className="space-y-4">
                                <li><a href="#" className="text-[14px] text-neutral-500 hover:text-indigo-600 transition-colors">Documentation</a></li>
                                <li><a href="#" className="text-[14px] text-neutral-500 hover:text-indigo-600 transition-colors">API Reference</a></li>
                                <li><a href="#" className="text-[14px] text-neutral-500 hover:text-indigo-600 transition-colors">Community</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-[13px] font-bold text-neutral-900 uppercase tracking-widest mb-6">Legal</h4>
                            <ul className="space-y-4">
                                <li><a href="#" className="text-[14px] text-neutral-500 hover:text-indigo-600 transition-colors">Privacy</a></li>
                                <li><a href="#" className="text-[14px] text-neutral-500 hover:text-indigo-600 transition-colors">Terms</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-20 pt-8 border-t border-neutral-200/60 flex flex-col md:flex-row justify-between items-center gap-6">
                        <p className="text-[13px] text-neutral-400">
                            &copy; 2026 DataTrustX AI Platform. All rights reserved.
                        </p>
                        <div className="flex space-x-8">
                            <a href="#" className="text-[13px] font-bold text-neutral-400 hover:text-indigo-600 transition-colors uppercase tracking-widest">
                                Twitter
                            </a>
                            <a href="#" className="text-[13px] font-bold text-neutral-400 hover:text-indigo-600 transition-colors uppercase tracking-widest">
                                GitHub
                            </a>
                            <a href="#" className="text-[13px] font-bold text-neutral-400 hover:text-indigo-600 transition-colors uppercase tracking-widest">
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

