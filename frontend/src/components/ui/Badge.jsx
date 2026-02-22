import React from 'react';

const Badge = ({ children, variant = 'default', className = '' }) => {
    const variants = {
        default: 'bg-gray-100 dark:bg-surface-700 text-gray-800 dark:text-gray-200',
        primary: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
        success: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
        warning: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
        danger: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
        purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300',
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
            {children}
        </span>
    );
};

export default Badge;
