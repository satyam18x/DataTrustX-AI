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
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16 px-6 text-center"
        >
            <div className="w-20 h-20 rounded-2xl bg-indigo-50 flex items-center justify-center mb-6">
                <Icon className="w-10 h-10 text-indigo-500" strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-2">
                {title}
            </h3>
            <p className="text-neutral-500 text-[15px] max-w-sm mb-8 leading-relaxed">
                {description}
            </p>
            {action && (
                <div className="flex justify-center">
                    {action}
                </div>
            )}
        </motion.div>
    );
};

export default EmptyState;

