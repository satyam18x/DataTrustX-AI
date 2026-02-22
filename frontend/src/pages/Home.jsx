import React from 'react';
import { motion } from 'framer-motion';
import {
    ChevronRight,
    ShieldCheck,
    Zap,
    BarChart3,
    Globe,
    Database,
    Lock,
    Users,
    Star,
    CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const Home = () => {
    const features = [
        {
            title: "ML-Verified Quality",
            description: "Every dataset is automatically validated using our proprietary PyTorch-based ML engine.",
            icon: ShieldCheck,
            color: "text-blue-600",
            bg: "bg-blue-100 dark:bg-blue-900/30"
        },
        {
            title: "Secure Escrow",
            description: "Payments are held securely in escrow and only released when you confirm delivery.",
            icon: Lock,
            color: "text-purple-600",
            bg: "bg-purple-100 dark:bg-purple-900/30"
        },
        {
            title: "Global Marketplace",
            description: "Access high-quality data from sellers worldwide or monetize your own data sets.",
            icon: Globe,
            color: "text-indigo-600",
            bg: "bg-indigo-100 dark:bg-indigo-900/30"
        },
        {
            title: "Fast Delivery",
            description: "Instant access to validated data with our optimized storage and retrieval system.",
            icon: Zap,
            color: "text-yellow-600",
            bg: "bg-yellow-100 dark:bg-yellow-900/30"
        }
    ];

    const testimonials = [
        {
            name: "Sarah Chen",
            role: "Senior Data Scientist @ TechCorp",
            content: "DataTrustX has revolutionized how we source training data. The ML verification gives us confidence in every purchase.",
            avatar: "SC"
        },
        {
            name: "Marcus Thorne",
            role: "Founder @ AI Gen",
            content: "Selling our specialized datasets was a breeze. Seamless escrow and instant validation made trust a non-issue.",
            avatar: "MT"
        }
    ];

    return (
        <div className="overflow-hidden">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32">
                <div className="absolute inset-0 bg-gradient-mesh opacity-20 dark:opacity-40 -z-10"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 px-4 py-1.5 rounded-full mb-8"
                        >
                            <span className="flex h-2 w-2 rounded-full bg-blue-600"></span>
                            <span className="text-sm font-bold text-blue-700 dark:text-blue-400">Newly Launched v2.0</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                            className="text-5xl lg:text-7xl font-black text-gray-900 dark:text-white leading-tight mb-6"
                        >
                            The Future of <br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
                                Trusted Data Exchange
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.6 }}
                            className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10"
                        >
                            Buy and sell high-quality, ML-verified datasets securely.
                            Our escrow system and AI validation ensure transparency and quality for every transaction.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
                        >
                            <Link to="/register">
                                <Button size="lg" className="px-10 rounded-full h-14 text-lg">
                                    Start Marketplace <ChevronRight className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                            <Link to="/login">
                                <Button variant="outline" size="lg" className="px-10 rounded-full h-14 text-lg border-gray-300 dark:border-surface-300">
                                    Browse Requests
                                </Button>
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 bg-gray-50 dark:bg-surface-900/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { label: "Datasets", value: "2.5k+" },
                            { label: "Active Users", value: "10k+" },
                            { label: "Avg. Quality", value: "94%" },
                            { label: "Security", value: "100%" }
                        ].map((stat, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="text-center"
                            >
                                <p className="text-4xl font-black text-gray-900 dark:text-white mb-1">{stat.value}</p>
                                <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-base font-bold text-blue-600 uppercase tracking-widest mb-3">Why Choose Us</h2>
                        <p className="text-4xl font-black text-gray-900 dark:text-white">Empowering Your Data Journey</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, idx) => (
                            <Card key={idx} className="group hover:border-blue-500/50 transition-colors">
                                <div className={`w-14 h-14 ${feature.bg} rounded-2xl flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform`}>
                                    <feature.icon className={`w-7 h-7 ${feature.color}`} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {feature.description}
                                </p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-24 bg-gray-900 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full -mr-64 -mt-64"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/20 blur-[120px] rounded-full -ml-64 -mb-64"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl lg:text-5xl font-black mb-6">Simple 3-Step Process</h2>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">Get from data request to high-quality dataset in minutes.</p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-12">
                        {[
                            { step: "01", title: "Create Request", desc: "Buyers post their data needs, budget, and quality requirements." },
                            { step: "02", title: "Review & Pay", desc: "Sellers make offers. Buyer accepts and funds the secure escrow." },
                            { step: "03", title: "Verify & Get", desc: "Seller uploads, ML engine validates quality, and buyer downloads." }
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.2 }}
                                className="relative p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm"
                            >
                                <span className="text-6xl font-black text-white/10 absolute top-4 right-8">{item.step}</span>
                                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                                <p className="text-gray-400 leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-24 bg-gray-50 dark:bg-surface-900/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-base font-bold text-blue-600 uppercase tracking-widest mb-3">Testimonials</h2>
                            <p className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-8">Trusted by Global Teams</p>
                            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                                Join thousands of researchers, scientists, and businesses who use DataTrustX to fuel their AI models with quality-guaranteed data.
                            </p>
                            <div className="flex space-x-6">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">4.9/5</p>
                                    <div className="flex text-yellow-500 my-1">
                                        {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                                    </div>
                                    <p className="text-xs text-gray-500 uppercase font-bold">App Store</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">99%</p>
                                    <p className="text-yellow-500 my-1 font-bold">Trust Score</p>
                                    <p className="text-xs text-gray-500 uppercase font-bold">Trustpilot</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {testimonials.map((t, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    className="p-8 rounded-3xl bg-white dark:bg-surface-900 shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-surface-700"
                                >
                                    <p className="text-lg italic text-gray-700 dark:text-gray-300 mb-6 font-medium">"{t.content}"</p>
                                    <div className="flex items-center">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold mr-4">
                                            {t.avatar}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900 dark:text-white">{t.name}</p>
                                            <p className="text-sm text-gray-500">{t.role}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-r from-blue-600 to-indigo-800 rounded-[40px] p-12 lg:p-24 text-center text-white relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/20 rounded-full -ml-24 -mb-24"></div>

                        <h2 className="text-4xl lg:text-6xl font-black mb-8 relative z-10 leading-tight">
                            Ready to transform your <br /> data strategy?
                        </h2>
                        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 relative z-10">
                            <Link to="/register">
                                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-12 rounded-full h-16 text-xl">
                                    Join Now
                                </Button>
                            </Link>
                            <Link to="/login">
                                <Button variant="ghost" size="lg" className="text-white hover:bg-white/10 px-12 rounded-full h-16 text-xl">
                                    Contact Sales
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default Home;
