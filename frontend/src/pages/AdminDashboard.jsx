import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import marketplaceService from '../services/marketplace';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShieldAlert,
    FileCheck,
    Settings,
    Users,
    TrendingUp,
    AlertCircle,
    CheckCircle2,
    XCircle,
    ArrowRight,
    Search,
    Filter,
    Activity,
    Lock,
    Unlock,
    RotateCcw,
    RotateCw
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import EmptyState from '../components/ui/EmptyState';
import ValidationReportModal from '../components/ValidationReportModal';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const [disputes, setDisputes] = useState([]);
    const [validations, setValidations] = useState([]);
    const [activeTab, setActiveTab] = useState('disputes');
    const [isLoading, setIsLoading] = useState(true);
    const [selectedReport, setSelectedReport] = useState(null);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);

    useEffect(() => {
        if (user?.role === 'admin') {
            fetchData();
        }
    }, [user]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [disputesRes, validationsRes] = await Promise.all([
                marketplaceService.getDisputesAdmin(),
                marketplaceService.getValidations()
            ]);
            setDisputes(disputesRes.data);
            setValidations(validationsRes.data);
        } catch (err) {
            toast.error("Failed to fetch admin data");
        } finally {
            setIsLoading(false);
        }
    };

    const handleViewReport = async (reportId) => {
        const loadingToast = toast.loading('Fetching technical validation report...');
        try {
            const res = await marketplaceService.getValidationReportById(reportId);
            setSelectedReport(res.data);
            setIsReportModalOpen(true);
            toast.dismiss(loadingToast);
        } catch (err) {
            toast.error(err.response?.data?.detail || "Report not found.", { id: loadingToast });
        }
    };

    const handleResolve = async (disputeId, action) => {
        const confirmMsg = action === 'release'
            ? 'Release funds to seller? This action is final.'
            : 'Refund to buyer? This action is final.';

        if (!window.confirm(confirmMsg)) return;

        const loadingToast = toast.loading('Resolving dispute...');
        try {
            await marketplaceService.resolveDispute(disputeId, action);
            toast.success(`Dispute resolved. Funds ${action === 'release' ? 'released' : 'refunded'}.`, { id: loadingToast });
            fetchData();
        } catch (err) {
            toast.error(err.response?.data?.detail || 'Failed to resolve dispute', { id: loadingToast });
        }
    };

    if (user?.role !== 'admin') {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Card className="max-w-md p-10 text-center border-red-100 dark:border-red-900/30">
                    <Lock className="w-16 h-16 text-red-500 mx-auto mb-6 opacity-20" />
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-4">Access Denied</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-8">
                        This area is reserved for authorized system administrators only.
                    </p>
                    <Button onClick={() => window.history.back()} className="w-full">
                        Return Safely
                    </Button>
                </Card>
            </div>
        );
    }

    const stats = [
        { label: "Active Disputes", value: disputes.filter(d => d.deal_status !== 'resolved').length, icon: ShieldAlert, color: "text-red-600", bg: "bg-red-100 dark:bg-red-900/30" },
        { label: "System Checks", value: validations.length, icon: Activity, color: "text-blue-600", bg: "bg-blue-100 dark:bg-blue-900/30" },
        { label: "Total Users", value: "N/A", icon: Users, color: "text-indigo-600", bg: "bg-indigo-100 dark:bg-indigo-900/30" },
        { label: "Success Rate", value: "98.2%", icon: TrendingUp, color: "text-green-600", bg: "bg-green-100 dark:bg-green-900/30" },
    ];

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center">
                        <Settings className="mr-3 w-8 h-8 text-blue-600" /> System Control Panel
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Global oversight and conflict resolution center</p>
                </div>
                <div className="flex space-x-3">
                    <Button variant="outline" className="rounded-xl border-gray-200 dark:border-surface-300" onClick={fetchData}>
                        <RotateCcw className="w-4 h-4 mr-2" /> Sync Data
                    </Button>
                    <Button className="rounded-xl">System Health</Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <Card key={idx} hover={false} className="p-5 flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                            <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                            <p className="text-2xl font-black text-gray-900 dark:text-white">{stat.value}</p>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Tabs */}
            <div className="flex items-center space-x-2 bg-gray-100 dark:bg-surface-800 p-1.5 rounded-2xl w-fit">
                <button
                    onClick={() => setActiveTab('disputes')}
                    className={`px-6 py-2 rounded-xl text-sm font-black transition-all ${activeTab === 'disputes'
                        ? 'bg-white dark:bg-surface-900 text-blue-600 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    Disputes ({disputes.filter(d => d.deal_status !== 'resolved').length})
                </button>
                <button
                    onClick={() => setActiveTab('validations')}
                    className={`px-6 py-2 rounded-xl text-sm font-black transition-all ${activeTab === 'validations'
                        ? 'bg-white dark:bg-surface-900 text-blue-600 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    System Logs
                </button>
            </div>

            {isLoading ? (
                <div className="space-y-4">
                    <LoadingSkeleton count={5} type="text" className="h-12" />
                </div>
            ) : (
                <Card className="p-0 overflow-hidden border-none shadow-xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-surface-900">
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            {activeTab === 'disputes' ? (
                                <>
                                    <thead className="bg-gray-50 dark:bg-surface-800 border-b border-gray-100 dark:border-surface-300">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Case ID</th>
                                            <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Entities</th>
                                            <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Allegation / Reason</th>
                                            <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                            <th className="px-6 py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-surface-300">
                                        {disputes.length === 0 ? (
                                            <tr><td colSpan="5" className="px-6 py-10 text-center"><EmptyState title="Clear Queue" description="No active disputes in the system." /></td></tr>
                                        ) : (
                                            disputes.map((dispute) => (
                                                <tr key={dispute.dispute_id} className="hover:bg-gray-50/50 dark:hover:bg-surface-700 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="font-bold text-gray-900 dark:text-white">#{dispute.dispute_id}</span>
                                                        <p className="text-[10px] text-gray-500">DEAL: #{dispute.deal_id}</p>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <Badge variant={dispute.opened_by === 'buyer' ? 'primary' : 'purple'} className="text-[10px]">
                                                            BY {dispute.opened_by?.toUpperCase()}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <p className="text-sm text-gray-700 dark:text-gray-300 max-w-xs truncate">{dispute.reason}</p>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {dispute.deal_status === 'resolved' ? (
                                                            <Badge variant="success">Resolved</Badge>
                                                        ) : (
                                                            <Badge variant="danger" className="animate-pulse">Active Conflict</Badge>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                                        {dispute.deal_status !== 'resolved' ? (
                                                            <div className="flex justify-end space-x-2">
                                                                <Button
                                                                    size="sm"
                                                                    variant="success"
                                                                    className="rounded-lg text-[10px] font-black"
                                                                    onClick={() => handleResolve(dispute.dispute_id, 'release')}
                                                                >
                                                                    Release funds
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="primary"
                                                                    className="rounded-lg text-[10px] font-black"
                                                                    onClick={() => handleResolve(dispute.dispute_id, 'refund')}
                                                                >
                                                                    Refund buyer
                                                                </Button>
                                                            </div>
                                                        ) : (
                                                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                                                {dispute.resolution}
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </>
                            ) : (
                                <>
                                    <thead className="bg-gray-50 dark:bg-surface-800 border-b border-gray-100 dark:border-surface-300">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Trace ID</th>
                                            <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Origin</th>
                                            <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">ML Score</th>
                                            <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Verdict</th>
                                            <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Timestamp</th>
                                            <th className="px-6 py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-surface-300">
                                        {validations.length === 0 ? (
                                            <tr><td colSpan="6" className="px-6 py-10 text-center"><EmptyState title="No logs" description="No system validation logs found." /></td></tr>
                                        ) : (
                                            validations.map((v) => (
                                                <tr key={v.id} className="hover:bg-gray-50/50 dark:hover:bg-surface-700 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-900 dark:text-white">#{v.id}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">@{v.username}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center space-x-2">
                                                            <div className="w-16 h-1.5 bg-gray-100 dark:bg-surface-300 rounded-full overflow-hidden">
                                                                <div className={`h-full ${v.final_score >= 80 ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${v.final_score}%` }}></div>
                                                            </div>
                                                            <span className="text-xs font-black">{v.final_score?.toFixed(1)}%</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <Badge variant={v.status === 'passed' ? 'success' : 'danger'}>
                                                            {v.status?.toUpperCase()}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-[10px] text-gray-500 font-bold">
                                                        {new Date(v.created_at).toLocaleString()}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                                        <button
                                                            onClick={() => handleViewReport(v.id)}
                                                            className="text-[10px] font-black uppercase text-blue-600 hover:text-blue-700 dark:text-blue-400 tracking-widest underline underline-offset-4"
                                                        >
                                                            Audit Report
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </>
                            )}
                        </table>
                    </div>
                </Card>
            )}

            <ValidationReportModal
                isOpen={isReportModalOpen}
                onClose={() => setIsReportModalOpen(false)}
                reportData={selectedReport}
            />
        </div>
    );
};

export default AdminDashboard;
