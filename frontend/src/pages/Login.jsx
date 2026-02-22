import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';

const Login = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const loadingToast = toast.loading('Authenticating...');

        try {
            await login(credentials.username, credentials.password);
            toast.success(`Welcome back, ${credentials.username}!`, { id: loadingToast });
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.detail || 'Invalid username or password', { id: loadingToast });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-surface-900 p-4 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-mesh opacity-10 dark:opacity-20 -z-10"></div>
            <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-500/20 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-purple-500/20 rounded-full blur-[100px]"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md"
            >
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center space-x-2 group mb-6">
                        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                            <ShieldCheck className="text-white w-7 h-7" />
                        </div>
                        <span className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
                            DataTrustX
                        </span>
                    </Link>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white">Welcome Back</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Sign in to your account to continue</p>
                </div>

                <Card className="shadow-2xl shadow-blue-500/10 p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            label="Username"
                            name="username"
                            placeholder="Enter your username"
                            icon={Mail}
                            required
                            value={credentials.username}
                            onChange={handleChange}
                            autoComplete="username"
                        />

                        <div>
                            <Input
                                label="Password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                icon={Lock}
                                required
                                value={credentials.password}
                                onChange={handleChange}
                                autoComplete="current-password"
                            />
                            <div className="flex justify-end mt-2">
                                <Link to="#" className="text-xs font-bold text-blue-600 hover:text-blue-500">
                                    Forgot Password?
                                </Link>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 rounded-xl text-lg font-bold"
                            isLoading={isLoading}
                        >
                            Sign In <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-gray-100 dark:border-surface-700 text-center">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Don't have an account?{' '}
                            <Link to="/register" className="font-bold text-blue-600 hover:text-blue-500 underline underline-offset-4">
                                Create Account
                            </Link>
                        </p>
                    </div>
                </Card>

                {/* Return to Home */}
                <div className="text-center mt-8">
                    <Link to="/" className="inline-flex items-center text-sm font-bold text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
