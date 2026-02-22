import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { motion } from 'framer-motion';
import {
    CheckCircle2,
    XCircle,
    ShieldCheck,
    FileSearch,
    Clock,
    TrendingUp,
    History,
    Search,
    Download
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import EmptyState from '../components/ui/EmptyState';
import Button from '../components/ui/Button';
import ValidationReportModal from '../components/ValidationReportModal';
import marketplaceService from '../services/marketplace';

const ValidationHistory = () => {
    const { user } = useContext(AuthContext);
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedReport, setSelectedReport] = useState(null);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/history/');
            setHistory(res.data);
        } catch (err) {
            toast.error('Failed to fetch validation history');
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

    const stats = [
        { label: "Validations", value: history.length, icon: FileSearch, color: "text-blue-600", bg: "bg-blue-100 dark:bg-blue-900/30" },
        { label: "Passed", value: history.filter(h => h.status === 'passed').length, icon: CheckCircle2, color: "text-green-600", bg: "bg-green-100 dark:bg-green-900/30" },
        { label: "Failed", value: history.filter(h => h.status !== 'passed').length, icon: XCircle, color: "text-red-600", bg: "bg-red-100 dark:bg-red-900/30" },
        { label: "Avg Score", value: history.length ? (history.reduce((a, b) => a + b.final_score, 0) / history.length).toFixed(1) + "%" : "0%", icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-100 dark:bg-purple-900/30" }
    ];

    return (
        <div className="space-y-10">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center">
                    <History className="mr-3 w-8 h-8 text-blue-600" /> ML Validation Logs
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Deep inspection records of your uploaded datasets</p>
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

            {/* Logs List */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Activity Log</h2>
                    <Button variant="outline" size="sm" className="rounded-xl" onClick={fetchHistory}>Refresh Logs</Button>
                </div>

                {isLoading ? (
                    <div className="grid gap-4">
                        <LoadingSkeleton count={4} type="card" className="h-24" />
                    </div>
                ) : history.length === 0 ? (
                    <Card className="flex items-center justify-center py-20">
                        <EmptyState icon={ShieldCheck} title="No activity" description="Datasets you upload will be analyzed and logged here." />
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {history.map((record) => (
                            <motion.div
                                key={record.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                            >
                                <Card className="p-0 overflow-hidden group hover:border-blue-500 transition-colors">
                                    <div className="flex flex-col sm:flex-row">
                                        <div className={`p-6 sm:w-48 flex items-center justify-center ${record.status === 'passed' ? 'bg-green-500/10 dark:bg-green-500/5' : 'bg-red-500/10 dark:bg-red-500/5'
                                            }`}>
                                            <div className="text-center">
                                                <span className={`text-2xl font-black ${record.status === 'passed' ? 'text-green-600' : 'text-red-600'}`}>
                                                    {record.final_score?.toFixed(1)}%
                                                </span>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Trust Score</p>
                                            </div>
                                        </div>
                                        <div className="flex-1 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                            <div className="flex items-center space-x-4">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${record.status === 'passed' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                                    }`}>
                                                    {record.status === 'passed' ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-900 dark:text-white flex items-center">
                                                        Validation Trace #{record.id}
                                                        <Badge variant={record.status === 'passed' ? 'success' : 'danger'} className="ml-3 text-[10px]">
                                                            {record.status?.toUpperCase()}
                                                        </Badge>
                                                    </h4>
                                                    <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                                                        <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1" /> {new Date(record.created_at).toLocaleString()}</span>
                                                        <span className="flex items-center text-blue-600"><ShieldCheck className="w-3.5 h-3.5 mr-1" /> ML Certified</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="rounded-xl text-[10px] font-black uppercase text-blue-600 hover:text-blue-700 dark:text-blue-400 tracking-widest"
                                                    onClick={() => handleViewReport(record.id)}
                                                >
                                                    Analysis Report
                                                </Button>
                                                <Button variant="outline" size="sm" className="rounded-xl border-gray-200 dark:border-surface-700">
                                                    <Download className="w-4 h-4 mr-2" /> Summary
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            <ValidationReportModal
                isOpen={isReportModalOpen}
                onClose={() => setIsReportModalOpen(false)}
                reportData={selectedReport}
            />
        </div>
    );
};

export default ValidationHistory;
