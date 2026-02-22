import React, { useState, useEffect } from 'react';
import marketplaceService from '../services/marketplace';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Globe,
    Rocket,
    ArrowUpRight,
    IndianRupee,
    Users,
    TrendingUp,
    Search,
    Filter,
    Briefcase,
    Calendar,
    ChevronRight,
    Send,
    Database,
    Tag,
    X
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import EmptyState from '../components/ui/EmptyState';

const SellerDashboard = () => {
    const [requests, setRequests] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [offer, setOffer] = useState({ price: '', message: '' });
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchMarketplace();
    }, []);

    const fetchMarketplace = async () => {
        setIsLoading(true);
        try {
            const res = await marketplaceService.getAllRequests();
            setRequests(res.data);
        } catch (err) {
            toast.error("Failed to fetch open requests");
        } finally {
            setIsLoading(false);
        }
    };

    const handleMakeOffer = async (e) => {
        e.preventDefault();
        if (!selectedRequest) return;
        setIsSubmitting(true);
        const loadingToast = toast.loading('Sending offer...');

        try {
            await marketplaceService.createOffer({
                request_id: selectedRequest.id,
                price: parseFloat(offer.price),
                message: offer.message
            });
            toast.success(`Offer sent for "${selectedRequest.title}"!`, { id: loadingToast });
            setOffer({ price: '', message: '' });
            setSelectedRequest(null);
            fetchMarketplace(); // Refresh
        } catch (err) {
            toast.error('Failed to submit offer.', { id: loadingToast });
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredRequests = requests.filter(req =>
        req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.domain.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Placeholder stats
    const stats = [
        { label: "Earnings", value: "₹0", icon: IndianRupee, color: "text-green-600", bg: "bg-green-100 dark:bg-green-900/30" },
        { label: "Active Offers", value: "0", icon: Send, color: "text-blue-600", bg: "bg-blue-100 dark:bg-blue-900/30" },
        { label: "Completion Rate", value: "100%", icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-100 dark:bg-purple-900/30" },
        { label: "Trust Score", value: "N/A", icon: Rocket, color: "text-indigo-600", bg: "bg-indigo-100 dark:bg-indigo-900/30" },
    ];

    return (
        <div className="space-y-10">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white">Seller Dashboard</h1>
                    <p className="text-gray-500 dark:text-gray-400">Discover data requirements and monetize your datasets</p>
                </div>
                <div className="flex bg-white dark:bg-surface-900 p-1.5 rounded-2xl shadow-sm border border-gray-100 dark:border-surface-300 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Find datasets..."
                            className="w-full pl-10 pr-4 py-2 bg-transparent border-none focus:ring-0 text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <Card key={idx} hover={false} className="p-5 flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                            <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">{stat.label}</p>
                            <p className="text-2xl font-black text-gray-900 dark:text-white">{stat.value}</p>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Marketplace Grid */}
            <div>
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-2">
                        <Globe className="w-6 h-6 text-indigo-600" />
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white">Open Marketplace</h2>
                    </div>
                    <Badge variant="purple" className="px-4 py-1.5 text-xs uppercase font-black tracking-widest">
                        {filteredRequests.length} Opportunities
                    </Badge>
                </div>

                {isLoading ? (
                    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                        <LoadingSkeleton count={6} type="card" />
                    </div>
                ) : filteredRequests.length === 0 ? (
                    <Card className="flex items-center justify-center py-20">
                        <EmptyState
                            icon={Database}
                            title="No requests found"
                            description="Check back later or try adjusting your search filters."
                        />
                    </Card>
                ) : (
                    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredRequests.map((req) => (
                            <motion.div
                                key={req.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                            >
                                <Card className="h-full flex flex-col p-6 group hover:border-indigo-500 transition-colors bg-white dark:bg-surface-900">
                                    <div className="flex items-start justify-between mb-4">
                                        <Badge variant="primary">{req.domain}</Badge>
                                        <span className="text-[10px] font-black uppercase tracking-tighter text-gray-400">ID: #{req.id}</span>
                                    </div>
                                    <h3 className="text-xl font-black text-gray-900 dark:text-white mb-3 group-hover:text-indigo-600 transition-colors">
                                        {req.title}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-6 flex-1 italic leading-relaxed">
                                        "{req.description}"
                                    </p>
                                    <div className="pt-6 border-t border-gray-100 dark:border-surface-700 flex items-center justify-between">
                                        <div className="flex items-center text-xs text-gray-500 font-bold">
                                            <Calendar className="w-3.5 h-3.5 mr-1.5" />
                                            {new Date(req.created_at).toLocaleDateString()}
                                        </div>
                                        <Button
                                            size="sm"
                                            variant="primary"
                                            className="rounded-xl font-bold px-6"
                                            onClick={() => setSelectedRequest(req)}
                                        >
                                            Make Offer <ArrowUpRight className="ml-2 w-4 h-4" />
                                        </Button>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Offer Modal */}
            <Modal
                isOpen={!!selectedRequest}
                onClose={() => setSelectedRequest(null)}
                title="Submit Your Proposal"
                size="md"
            >
                {selectedRequest && (
                    <form onSubmit={handleMakeOffer} className="space-y-6">
                        <div className="bg-gray-50 dark:bg-surface-700 p-4 rounded-xl border border-gray-100 dark:border-surface-300">
                            <div className="flex items-center space-x-2 mb-2">
                                <Tag className="w-4 h-4 text-indigo-600" />
                                <span className="text-xs font-black uppercase tracking-widest text-gray-500">Target Request</span>
                            </div>
                            <h4 className="font-bold text-gray-900 dark:text-white">{selectedRequest.title}</h4>
                            <p className="text-xs text-gray-500 mt-1">{selectedRequest.domain}</p>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            <Input
                                label="Asking Price (₹)"
                                name="price"
                                type="number"
                                required
                                min="0"
                                step="0.01"
                                placeholder="0.00"
                                icon={IndianRupee}
                                value={offer.price}
                                onChange={(e) => setOffer({ ...offer, price: e.target.value })}
                            />
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Proposal Message
                                </label>
                                <textarea
                                    required
                                    rows={4}
                                    className="block w-full rounded-xl border border-gray-300 dark:border-surface-300 bg-white dark:bg-surface-900 text-gray-900 dark:text-white p-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                    placeholder="Explain why your dataset is perfect for this request..."
                                    value={offer.message}
                                    onChange={(e) => setOffer({ ...offer, message: e.target.value })}
                                />
                                <p className="mt-2 text-[10px] text-gray-400">Include details about size, format, and source of your data.</p>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <Button
                                variant="outline"
                                className="flex-1 rounded-xl py-3 border-gray-200 dark:border-surface-300"
                                onClick={() => setSelectedRequest(null)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="flex-1 rounded-xl py-3"
                                isLoading={isSubmitting}
                            >
                                Send Proposal
                            </Button>
                        </div>
                    </form>
                )}
            </Modal>
        </div>
    );
};

export default SellerDashboard;
