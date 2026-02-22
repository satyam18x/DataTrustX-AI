import React from 'react';
import { motion } from 'framer-motion';
import { Inbox } from 'lucide-react';

const EmptyState = ({
    icon: Icon = Inbox,
    title = 'No data found',
    description = 'Get started by creating something new.',
    action
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-12 px-4"
        >
            <div className="rounded-full bg-gray-100 dark:bg-surface-800 p-6 mb-4">
                <Icon className="w-12 h-12 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {title}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-center max-w-md mb-6">
                {description}
            </p>
            {action && action}
        </motion.div>
    );
};

export default EmptyState;
