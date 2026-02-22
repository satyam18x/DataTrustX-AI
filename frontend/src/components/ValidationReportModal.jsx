import React, { useState } from 'react';
import Modal from './ui/Modal';
import Badge from './ui/Badge';

const ValidationReportModal = ({ isOpen, onClose, reportData }) => {
    if (!isOpen || !reportData) return null;

    const {
        final_score = 0,
        status = 'unknown',
        username = 'user',
        report = {}
    } = reportData;

    const score = Number(final_score) || 0;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Data Quality Report"
            size="lg"
        >
            <div className="space-y-6">
                <div className="p-6 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/20">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-bold">Trust Score</h3>
                            <p className="text-sm text-gray-500">Verified for @{username}</p>
                        </div>
                        <div className="text-right">
                            <span className="text-3xl font-black text-blue-600">{score.toFixed(1)}%</span>
                            <div className="mt-1">
                                <Badge variant={status.toLowerCase() === 'passed' || status === 'PASS' ? 'success' : 'danger'}>
                                    {status.toUpperCase()}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid gap-4">
                    <h4 className="font-bold text-sm uppercase tracking-wider text-gray-400">Analysis Modules</h4>
                    {report?.all_reports && Object.entries(report.all_reports).map(([key, data]) => (
                        <div key={key} className="p-4 rounded-xl border border-gray-100 dark:border-surface-700 bg-gray-50 dark:bg-surface-800">
                            <div className="flex items-center justify-between mb-1">
                                <span className="font-bold text-sm">{key.replace(/_/g, ' ').toUpperCase()}</span>
                                <span className="text-xs font-bold">{(Number(data.score) || (data[key.replace('_report', '_score')] * 100) || 0).toFixed(0)}%</span>
                            </div>
                            <p className="text-xs text-gray-500">
                                {typeof data.summary === 'string' ? data.summary :
                                    typeof data.reason === 'string' ? data.reason :
                                        "Check completed successfully."}
                            </p>
                        </div>
                    ))}
                </div>

                <details className="mt-4">
                    <summary className="text-xs font-bold text-gray-400 cursor-pointer uppercase tracking-tight">Technical Data (JSON)</summary>
                    <pre className="mt-2 p-4 bg-gray-900 text-green-400 text-[10px] rounded-lg overflow-auto max-h-40">
                        {JSON.stringify(reportData, null, 2)}
                    </pre>
                </details>
            </div>
        </Modal>
    );
};

export default ValidationReportModal;
