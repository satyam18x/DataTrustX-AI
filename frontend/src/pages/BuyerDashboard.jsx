import React, { useState, useEffect } from 'react';
import marketplaceService from '../services/marketplace';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    ClipboardList,
    Clock,
    CheckCircle2,
    Tag,
    Maximize2,
    ChevronDown,
    ChevronUp,
    Briefcase,
    IndianRupee,
    Search,
    MessageSquare,
    User
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import EmptyState from '../components/ui/EmptyState';

const BuyerDashboard = () => {
    const [requests, setRequests] = useState([]);
    const [newRequest, setNewRequest] = useState({ title: '', description: '', domain: '' });
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [offers, setOffers] = useState([]);
    const [isFetchingOffers, setIsFetchingOffers] = useState(false);

    useEffect(() => {
        fetchMyRequests();
    }, []);

    const fetchMyRequests = async () => {
        setIsLoading(true);
        try {
            const res = await marketplaceService.getMyRequests();
            setRequests(res.data);
        } catch (err) {
            toast.error("Failed to fetch your requests");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateRequest = async (e) => {
        e.preventDefault();
        setIsCreating(true);
        const loadingToast = toast.loading('Posting request...');
        try {
            await marketplaceService.createRequest(newRequest);
            toast.success('Request posted successfully!', { id: loadingToast });
            setNewRequest({ title: '', description: '', domain: '' });
            fetchMyRequests();
        } catch (err) {
            toast.error('Failed to create request.', { id: loadingToast });
        } finally {
            setIsCreating(false);
        }
    };

    const handleViewOffers = async (request) => {
        if (selectedRequest?.id === request.id) {
            setSelectedRequest(null);
            setOffers([]);
            return;
        }

        setIsFetchingOffers(true);
        setSelectedRequest(request);
        try {
            const res = await marketplaceService.getOffers(request.id);
            setOffers(res.data);
        } catch (err) {
            toast.error("Failed to fetch offers for this request");
        } finally {
            setIsFetchingOffers(false);
        }
    };

    const handleAcceptOffer = async (offerId) => {
        const loadingToast = toast.loading('Accepting offer...');
        try {
            await marketplaceService.acceptOffer(offerId);
            toast.success('Offer accepted! Deal created.', { id: loadingToast });
            // Refresh requests to update UI (optional, or redirect to deals)
            fetchMyRequests();
        } catch (err) {
            toast.error('Failed to accept offer.', { id: loadingToast });
        }
    };

    // Calculate stats (some real, some placeholder for aesthetic)
    const stats = [
        { label: "Active Requests", value: requests.length, icon: ClipboardList, color: "text-blue-600", bg: "bg-blue-100 dark:bg-blue-900/30" },
        { label: "Total Spent", value: "₹0", icon: IndianRupee, color: "text-green-600", bg: "bg-green-100 dark:bg-green-900/30" },
        { label: "Pending Offers", value: "0", icon: MessageSquare, color: "text-yellow-600", bg: "bg-yellow-100 dark:bg-yellow-900/30" },
        { label: "Successful Deals", value: "0", icon: CheckCircle2, color: "text-purple-600", bg: "bg-purple-100 dark:bg-purple-900/30" },
    ];

    return (
        <div className="space-y-10">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white">Buyer Dashboard</h1>
                    <p className="text-gray-500 dark:text-gray-400">Manage your data requests and acquisition strategy</p>
                </div>
                <div className="flex space-x-3">
                    <Button variant="outline" className="rounded-xl border-gray-200 dark:border-surface-300">
                        <Search className="w-4 h-4 mr-2" /> Search Data
                    </Button>
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

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Create Request Section */}
                <div className="lg:col-span-1">
                    <Card className="p-6 sticky top-24">
                        <div className="flex items-center space-x-2 mb-6">
                            <Plus className="w-5 h-5 text-blue-600" />
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Post New Request</h2>
                        </div>
                        <form onSubmit={handleCreateRequest} className="space-y-5">
                            <Input
                                label="Title"
                                placeholder="e.g. Healthcare Image Dataset"
                                value={newRequest.title}
                                onChange={(e) => setNewRequest({ ...newRequest, title: e.target.value })}
                                required
                            />
                            <Input
                                label="Domain / Category"
                                placeholder="e.g. Medical, Finance"
                                value={newRequest.domain}
                                onChange={(e) => setNewRequest({ ...newRequest, domain: e.target.value })}
                                required
                            />
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Description
                                </label>
                                <textarea
                                    className="block w-full rounded-lg border border-gray-300 dark:border-surface-300 bg-white dark:bg-surface-900 text-gray-900 dark:text-white p-3 min-h-[120px] focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="Describe your data requirements..."
                                    value={newRequest.description}
                                    onChange={(e) => setNewRequest({ ...newRequest, description: e.target.value })}
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full rounded-xl py-3" isLoading={isCreating}>
                                Post Request
                            </Button>
                        </form>
                    </Card>
                </div>

                {/* Requests List Section */}
                <div className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-2">
                            <Clock className="w-5 h-5 text-purple-600" />
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">My Request History</h2>
                        </div>
                        <Badge variant="primary">{requests.length} Total</Badge>
                    </div>

                    {isLoading ? (
                        <div className="space-y-4">
                            <LoadingSkeleton count={3} type="card" className="h-24" />
                        </div>
                    ) : requests.length === 0 ? (
                        <Card className="flex items-center justify-center py-20">
                            <EmptyState
                                title="No requests yet"
                                description="Your data request history will appear here once you post your first requirement."
                            />
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {requests.map((req) => (
                                <div key={req.id} className="group">
                                    <div
                                        onClick={() => handleViewOffers(req)}
                                        className={`flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl border transition-all duration-300 cursor-pointer ${selectedRequest?.id === req.id
                                            ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/30'
                                            : 'bg-white dark:bg-surface-900 border-gray-100 dark:border-surface-700 hover:border-blue-500 shadow-sm'
                                            }`}
                                    >
                                        <div className="mb-4 sm:mb-0">
                                            <div className="flex items-center space-x-2 mb-1">
                                                <h3 className={`font-black text-lg ${selectedRequest?.id === req.id ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                                                    {req.title}
                                                </h3>
                                                <Badge variant={selectedRequest?.id === req.id ? "purple" : "primary"}>
                                                    {req.domain}
                                                </Badge>
                                            </div>
                                            <div className={`flex items-center space-x-4 text-sm ${selectedRequest?.id === req.id ? 'text-blue-100' : 'text-gray-500'}`}>
                                                <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1" /> {new Date(req.created_at).toLocaleDateString()}</span>
                                                <span className="flex items-center"><Tag className="w-3.5 h-3.5 mr-1" /> Request ID: #{req.id}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <span className="text-sm font-bold uppercase tracking-widest hidden sm:block">
                                                {selectedRequest?.id === req.id ? 'Hide Details' : 'View Offers'}
                                            </span>
                                            {selectedRequest?.id === req.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                        </div>
                                    </div>

                                    {/* Expandable Offers Content */}
                                    <AnimatePresence>
                                        {selectedRequest?.id === req.id && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="mt-4 p-6 rounded-2xl border border-gray-200 dark:border-surface-700 bg-gray-50/50 dark:bg-surface-800 space-y-6">
                                                    <div>
                                                        <h4 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Requirement Description</h4>
                                                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{req.description}</p>
                                                    </div>

                                                    <div>
                                                        <div className="flex items-center justify-between mb-4">
                                                            <h4 className="text-xs font-black uppercase tracking-widest text-gray-500">Offers Received</h4>
                                                            {isFetchingOffers && <LoadingSkeleton count={1} type="text" className="w-20" />}
                                                        </div>

                                                        {!isFetchingOffers && offers.length === 0 ? (
                                                            <div className="text-center py-6 bg-white dark:bg-surface-900 rounded-xl border border-dashed border-gray-300 dark:border-surface-300">
                                                                <p className="text-sm text-gray-500 italic">No offers received for this request yet.</p>
                                                            </div>
                                                        ) : (
                                                            <div className="space-y-3">
                                                                {offers.map(offer => (
                                                                    <motion.div
                                                                        key={offer.offer_id}
                                                                        initial={{ opacity: 0, x: -10 }}
                                                                        animate={{ opacity: 1, x: 0 }}
                                                                        className="bg-white dark:bg-surface-900 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-surface-300 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-blue-500 transition-colors"
                                                                    >
                                                                        <div className="flex items-start space-x-3">
                                                                            <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-surface-700 flex items-center justify-center text-blue-600 font-bold">
                                                                                {offer.seller?.[0]?.toUpperCase()}
                                                                            </div>
                                                                            <div>
                                                                                <div className="flex items-center space-x-2">
                                                                                    <span className="font-bold text-gray-900 dark:text-white">@{offer.seller}</span>
                                                                                    <Badge variant="success" className="text-[10px] font-black uppercase">Verified Seller</Badge>
                                                                                </div>
                                                                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-1">{offer.message}</p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex items-center w-full sm:w-auto justify-between sm:justify-end gap-6 sm:border-l sm:border-gray-100 sm:pl-6">
                                                                            <span className="text-xl font-black text-gray-900 dark:text-white">₹{offer.price}</span>
                                                                            <Button
                                                                                size="sm"
                                                                                className="rounded-lg font-bold"
                                                                                onClick={() => handleAcceptOffer(offer.offer_id)}
                                                                            >
                                                                                Accept
                                                                            </Button>
                                                                        </div>
                                                                    </motion.div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BuyerDashboard;
