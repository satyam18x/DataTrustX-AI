import React, { useState, useEffect, useContext } from 'react';
import marketplaceService from '../services/marketplace';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CreditCard,
    Truck,
    CheckCircle2,
    Download,
    AlertTriangle,
    FileText,
    Clock,
    IndianRupee,
    User,
    UploadCloud,
    ExternalLink,
    ShieldAlert,
    BarChart3,
    ShieldCheck
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import EmptyState from '../components/ui/EmptyState';

import ValidationReportModal from '../components/ValidationReportModal';

const DealsPage = () => {
    const { user } = useContext(AuthContext);
    const [deals, setDeals] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedReport, setSelectedReport] = useState(null);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);

    useEffect(() => {
        fetchDeals();
    }, []);

    const fetchDeals = async () => {
        setIsLoading(true);
        try {
            const res = await marketplaceService.getMyDeals();
            setDeals(res.data);
        } catch (err) {
            toast.error("Failed to fetch deal history");
        } finally {
            setIsLoading(false);
        }
    };

    const handleViewReport = async (dealId) => {
        const loadingToast = toast.loading('Fetching detailed validation report...');
        try {
            const res = await marketplaceService.getValidationReportByDeal(dealId);
            setSelectedReport(res.data);
            setIsReportModalOpen(true);
            toast.dismiss(loadingToast);
        } catch (err) {
            toast.error(err.response?.data?.detail || "Report not found for this deal.", { id: loadingToast });
        }
    };

    const handlePay = async (dealId) => {
        const loadingToast = toast.loading('Processing escrow payment...');
        try {
            await marketplaceService.payEscrow(dealId);
            toast.success('Payment successful! Funds held in escrow secure.', { id: loadingToast });
            fetchDeals();
        } catch (err) {
            toast.error('Payment failed. Please try again.', { id: loadingToast });
        }
    };

    const handleDeliver = async (dealId) => {
        const fileInput = document.getElementById(`file-${dealId}`);
        const file = fileInput?.files[0];

        if (!file) {
            toast.error("Please select a valid .csv file to upload.");
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        const loadingToast = toast.loading('Uploading and validating dataset... Our ML engine is inspecting the data.', { duration: 5000 });
        try {
            const res = await marketplaceService.markDelivered(dealId, formData);
            toast.success(`Success! Quality Score: ${res.data.score}%`, { id: loadingToast });
            fetchDeals();
        } catch (err) {
            const msg = err.response?.data?.detail || 'Failed to deliver dataset.';
            toast.error(msg, { id: loadingToast });
        }
    };

    const handleDownload = async (dealId) => {
        const loadingToast = toast.loading('Preparing secure download...');
        try {
            const response = await marketplaceService.downloadDataset(dealId);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `dataset_deal_${dealId}.csv`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            toast.success('Download started.', { id: loadingToast });
        } catch (err) {
            toast.error('Failed to download dataset. Link might have expired.', { id: loadingToast });
        }
    };

    const handleDispute = async (dealId) => {
        const reason = prompt("Please describe the issue (e.g., 'Data corrupt', 'Not delivered'):");
        if (!reason) return;

        const loadingToast = toast.loading('Raising dispute...');
        try {
            await marketplaceService.raiseDispute(dealId, reason);
            toast.success('Dispute raised. Our team will review it within 24h.', { id: loadingToast });
            fetchDeals();
        } catch (err) {
            toast.error(err.response?.data?.detail || 'Failed to raise dispute.', { id: loadingToast });
        }
    };

    const handleConfirm = async (dealId) => {
        if (!window.confirm('Confirm delivery receipt? This will release escrow funds to the seller. This action cannot be undone.')) return;

        const loadingToast = toast.loading('Releasing escrow funds...');
        try {
            await marketplaceService.confirmDelivery(dealId);
            toast.success('Delivery confirmed! Funds released.', { id: loadingToast });
            fetchDeals();
        } catch (err) {
            toast.error(err.response?.data?.detail || 'Failed to confirm delivery.', { id: loadingToast });
        }
    };

    const filteredDeals = user?.role === 'buyer'
        ? deals.filter(deal => deal.buyer_username === user.username)
        : deals.filter(deal => deal.seller_username === user.username);

    return (
        <div className="space-y-10">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white">Track Your Deals</h1>
                    <p className="text-gray-500 dark:text-gray-400">Secure escrow-based transactions and dataset delivery</p>
                </div>
                <div className="flex items-center space-x-2 bg-white dark:bg-surface-900 p-2 rounded-2xl border border-gray-100 dark:border-surface-300">
                    <div className="flex -space-x-3">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-surface-900 bg-gray-200 dark:bg-surface-800 flex items-center justify-center text-[10px] font-bold">
                                <User className="w-4 h-4" />
                            </div>
                        ))}
                    </div>
                    <span className="text-xs font-bold text-gray-500 pr-2">+ {filteredDeals.length} Active Deals</span>
                </div>
            </div>

            {isLoading ? (
                <div className="grid gap-6">
                    <LoadingSkeleton count={3} type="card" className="h-40" />
                </div>
            ) : filteredDeals.length === 0 ? (
                <Card className="flex items-center justify-center py-20 bg-white/50 dark:bg-surface-900/50">
                    <EmptyState
                        icon={Truck}
                        title="No deals yet"
                        description="Once you accept an offer or your offer is accepted, deals will appear here."
                    />
                </Card>
            ) : (
                <div className="grid gap-6">
                    {filteredDeals.map((deal) => (
                        <motion.div
                            key={deal.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <Card className="overflow-hidden border-none shadow-xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-surface-900">
                                <div className="flex flex-col lg:flex-row">
                                    {/* Status Section */}
                                    <div className={`p-6 lg:w-64 flex flex-col justify-between ${deal.delivery_status === 'delivered'
                                        ? 'bg-green-500/10 dark:bg-green-500/5'
                                        : 'bg-blue-500/10 dark:bg-blue-500/5'
                                        }`}>
                                        <div>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Transaction ID</span>
                                            <h3 className="text-xl font-black text-gray-900 dark:text-white">#{deal.id}</h3>
                                        </div>
                                        <div className="space-y-3 mt-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-bold text-gray-500">Payment</span>
                                                <Badge variant={deal.payment_status === 'escrowed' ? 'success' : 'warning'}>
                                                    {deal.payment_status}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-bold text-gray-500">Delivery</span>
                                                <Badge variant={deal.delivery_status === 'delivered' ? 'success' : 'primary'}>
                                                    {deal.delivery_status}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content Section */}
                                    <div className="flex-1 p-6 lg:p-8 flex flex-col md:flex-row md:items-center justify-between gap-8">
                                        <div className="space-y-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-surface-800 flex items-center justify-center">
                                                    <FileText className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                                                </div>
                                                <div>
                                                    <h4 className="font-black text-gray-900 dark:text-white">Request Context</h4>
                                                    <p className="text-sm text-gray-500">Parent Request: #{deal.request_id}</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-8">
                                                <div>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Partner</p>
                                                    <div className="flex items-center space-x-2">
                                                        <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[8px] font-bold">
                                                            {user?.role === 'buyer' ? deal.seller_username[0]?.toUpperCase() : deal.buyer_username[0]?.toUpperCase()}
                                                        </div>
                                                        <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                                                            @{user?.role === 'buyer' ? deal.seller_username : deal.buyer_username}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Settlement</p>
                                                    <span className="text-xl font-black text-gray-900 dark:text-white flex items-center">
                                                        <IndianRupee className="w-4 h-4 mr-0.5" />{deal.price}
                                                    </span>
                                                </div>
                                            </div>

                                            {deal.quality_score !== null && (
                                                <div className="pt-2">
                                                    <div className="flex items-center justify-between mb-1.5">
                                                        <span className="text-xs font-bold text-gray-500">Quality Trust Score</span>
                                                        <span className={`text-xs font-black ${deal.quality_score >= 80 ? 'text-green-600' : 'text-blue-600'}`}>
                                                            {deal.quality_score?.toFixed(1)}%
                                                        </span>
                                                    </div>
                                                    <div className="h-1.5 w-full bg-gray-100 dark:bg-surface-300 rounded-full overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${deal.quality_score}%` }}
                                                            className={`h-full ${deal.quality_score >= 80 ? 'bg-green-500' : 'bg-blue-500'}`}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex flex-col gap-3 min-w-[200px]">
                                            {/* Buyer Actions */}
                                            {user?.role === 'buyer' && (
                                                <>
                                                    {deal.payment_status === 'pending' && (
                                                        <Button onClick={() => handlePay(deal.id)} className="w-full rounded-xl py-3 group">
                                                            Fund Escrow <ArrowUpRight className="ml-2 w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                                        </Button>
                                                    )}
                                                    {deal.delivery_status === 'delivered' && (
                                                        <>
                                                            <Button variant="success" onClick={() => handleDownload(deal.id)} className="w-full rounded-xl py-3 border-none">
                                                                <Download className="mr-2 w-4 h-4" /> Download Data
                                                            </Button>
                                                            <Button variant="ghost" onClick={() => handleViewReport(deal.id)} className="w-full rounded-xl py-3 text-blue-600 dark:text-blue-400">
                                                                <BarChart3 className="mr-2 w-4 h-4" /> View Quality Report
                                                            </Button>
                                                            {deal.payment_status === 'escrowed' && (
                                                                <Button variant="outline" onClick={() => handleConfirm(deal.id)} className="w-full rounded-xl py-3 border-green-500 text-green-600 dark:text-green-500 hover:bg-green-50">
                                                                    <CheckCircle2 className="mr-2 w-4 h-4" /> Confirm Receipt
                                                                </Button>
                                                            )}
                                                        </>
                                                    )}
                                                </>
                                            )}

                                            {/* Seller Actions */}
                                            {user?.role === 'seller' && (
                                                <>
                                                    {deal.payment_status === 'escrowed' && deal.delivery_status === 'pending' ? (
                                                        <div className="space-y-4">
                                                            <div className="relative group/upload">
                                                                <input
                                                                    type="file"
                                                                    id={`file-${deal.id}`}
                                                                    accept=".csv"
                                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                                />
                                                                <div className="border-2 border-dashed border-gray-200 dark:border-surface-300 rounded-xl p-4 text-center group-hover/upload:border-purple-500 transition-colors">
                                                                    <UploadCloud className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                                                                    <p className="text-[10px] font-bold text-gray-500 uppercase">Select .CSV</p>
                                                                </div>
                                                            </div>
                                                            <Button onClick={() => handleDeliver(deal.id)} className="w-full rounded-xl py-3 bg-purple-600 hover:bg-purple-700">
                                                                Validate & Deliver
                                                            </Button>
                                                        </div>
                                                    ) : deal.delivery_status === 'delivered' ? (
                                                        <div className="space-y-3">
                                                            <div className="text-center p-4 bg-green-50 dark:bg-green-500/5 rounded-xl border border-green-100 dark:border-green-500/20">
                                                                <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
                                                                <p className="text-xs font-bold text-green-600 uppercase">Delivered & Verified</p>
                                                            </div>
                                                            <Button variant="ghost" onClick={() => handleViewReport(deal.id)} className="w-full rounded-xl py-3 text-indigo-600 dark:text-indigo-400">
                                                                <ShieldCheck className="mr-2 w-4 h-4" /> View Technical Report
                                                            </Button>
                                                        </div>
                                                    ) : (
                                                        <div className="text-center p-4 bg-gray-50 dark:bg-surface-800 rounded-xl border border-gray-100 dark:border-surface-300">
                                                            <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Waiting for Escrow</p>
                                                        </div>
                                                    )}
                                                </>
                                            )}

                                            {/* Dispute Link */}
                                            {deal.payment_status === 'escrowed' && deal.dispute_status !== 'opened' && (
                                                <button
                                                    onClick={() => handleDispute(deal.id)}
                                                    className="text-[10px] font-bold uppercase tracking-widest text-red-400 hover:text-red-600 flex items-center justify-center transition-colors"
                                                >
                                                    <ShieldAlert className="w-3 h-3 mr-1" /> Raise Dispute
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* dispute status banner */}
                                {deal.dispute_status === 'opened' && (
                                    <div className="bg-red-600 text-white px-6 py-2 flex items-center text-xs font-bold uppercase tracking-[0.2em]">
                                        <AlertTriangle className="w-4 h-4 mr-3" />
                                        Critical: Dispute Opened - Funds Locked Pending Review
                                    </div>
                                )}
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}

            <ValidationReportModal
                isOpen={isReportModalOpen}
                onClose={() => setIsReportModalOpen(false)}
                reportData={selectedReport}
            />
        </div>
    );
};

const ArrowUpRight = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-9 9" />
    </svg>
);

export default DealsPage;
