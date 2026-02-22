import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Input = ({
    label,
    error,
    icon: Icon,
    type = 'text',
    className = '',
    ...props
}) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {label}
                </label>
            )}
            <div className="relative group/input">
                {Icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within/input:text-blue-500 transition-colors">
                        <Icon size={18} />
                    </div>
                )}
                <motion.input
                    type={type}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    whileFocus={{
                        scale: isFocused ? 1.01 : 1,
                    }}
                    className={`
                        block w-full rounded-lg border ${error ? 'border-red-500' : 'border-gray-300 dark:border-surface-700'} 
                        ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5
                        bg-white dark:bg-surface-900 
                        text-gray-900 dark:text-white
                        placeholder-gray-400 dark:placeholder-gray-500
                        focus:ring-2 focus:ring-blue-500 focus:border-transparent
                        transition-all duration-200
                        ${className}
                    `}
                    {...props}
                />
            </div>
            {error && (
                <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-sm text-red-600 dark:text-red-400"
                >
                    {error}
                </motion.p>
            )}
        </div>
    );
};

export default Input;
