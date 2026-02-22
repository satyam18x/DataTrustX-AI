import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, UserPlus, ArrowLeft, ArrowRight, ShieldCheck, ShoppingCart, Tag, Shield } from 'lucide-react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';

const Register = () => {
    const [user, setUser] = useState({
        username: '',
        password: '',
        role: 'buyer'
    });
    const [isLoading, setIsLoading] = useState(false);
    const { signup } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleRoleSelect = (role) => {
        setUser({ ...user, role });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const loadingToast = toast.loading('Creating your account...');

        try {
            await signup(user.username, user.password, user.role);
            toast.success('Account created successfully! Please log in.', { id: loadingToast });
            navigate('/login');
        } catch (err) {
            toast.error(err.response?.data?.detail || 'Registration failed', { id: loadingToast });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-surface-900 p-4 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-mesh opacity-10 dark:opacity-20 -z-10"></div>
            <div className="absolute top-1/4 -right-20 w-80 h-80 bg-blue-500/20 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-[100px]"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-lg"
            >
                <div className="text-center mb-6">
                    <Link to="/" className="inline-flex items-center space-x-2 group mb-4">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                            <ShieldCheck className="text-white w-6 h-6" />
                        </div>
                        <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
                            DataTrustX
                        </span>
                    </Link>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white">Get Started Today</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Choose your path and start exchanging data</p>
                </div>

                <Card className="shadow-2xl shadow-blue-500/10 p-6 sm:p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Role Selection */}
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => handleRoleSelect('buyer')}
                                className={`p-4 rounded-2xl border-2 transition-all duration-300 text-left relative overflow-hidden group ${user.role === 'buyer'
                                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                                    : 'border-gray-100 dark:border-surface-700 hover:border-blue-200'
                                    }`}
                            >
                                <ShoppingCart className={`w-6 h-6 mb-2 ${user.role === 'buyer' ? 'text-blue-600' : 'text-gray-400'}`} />
                                <p className={`text-xs font-bold ${user.role === 'buyer' ? 'text-blue-700 dark:text-blue-300' : 'text-gray-600 dark:text-gray-400'}`}>Buyer</p>
                                {user.role === 'buyer' && (
                                    <motion.div layoutId="role-indicator" className="absolute top-2 right-2 w-2 h-2 bg-blue-600 rounded-full" />
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={() => handleRoleSelect('seller')}
                                className={`p-4 rounded-2xl border-2 transition-all duration-300 text-left relative overflow-hidden group ${user.role === 'seller'
                                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20'
                                    : 'border-gray-100 dark:border-surface-700 hover:border-indigo-200'
                                    }`}
                            >
                                <Tag className={`w-6 h-6 mb-2 ${user.role === 'seller' ? 'text-indigo-600' : 'text-gray-400'}`} />
                                <p className={`text-xs font-bold ${user.role === 'seller' ? 'text-indigo-700 dark:text-indigo-300' : 'text-gray-600 dark:text-gray-400'}`}>Seller</p>
                                {user.role === 'seller' && (
                                    <motion.div layoutId="role-indicator" className="absolute top-2 right-2 w-2 h-2 bg-indigo-600 rounded-full" />
                                )}
                            </button>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            <Input
                                label="Username"
                                name="username"
                                placeholder="john_doe"
                                icon={User}
                                required
                                value={user.username}
                                onChange={handleChange}
                            />
                        </div>

                        <Input
                            label="Password"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            icon={Lock}
                            required
                            value={user.password}
                            onChange={handleChange}
                        />

                        <div className="flex items-start space-x-2 pb-2">
                            <input type="checkbox" required className="mt-1 w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300" />
                            <label className="text-xs text-gray-500 dark:text-gray-400">
                                I agree to the <Link to="#" className="text-blue-600 font-bold hover:underline">Terms of Service</Link> and <Link to="#" className="text-blue-600 font-bold hover:underline">Privacy Policy</Link>.
                            </label>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 rounded-xl text-lg font-bold"
                            isLoading={isLoading}
                        >
                            Create Account <UserPlus className="ml-2 w-5 h-5" />
                        </Button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-gray-100 dark:border-surface-800 text-center">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Already have an account?{' '}
                            <Link to="/login" className="font-bold text-blue-600 hover:text-blue-500 underline underline-offset-4">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </Card>

                {/* Return to Home */}
                <div className="text-center mt-6">
                    <Link to="/" className="inline-flex items-center text-sm font-bold text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
