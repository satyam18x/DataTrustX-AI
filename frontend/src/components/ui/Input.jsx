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
                <label className="block text-[13px] font-semibold text-neutral-700 mb-1.5 ml-0.5">
                    {label}
                </label>
            )}
            <div className="relative">
                {Icon && (
                    <div className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200 ${isFocused ? 'text-indigo-500' : 'text-neutral-400'}`}>
                        <Icon size={18} strokeWidth={2.2} />
                    </div>
                )}
                <input
                    type={type}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className={`
                        block w-full rounded-lg border text-neutral-900 text-[15px]
                        ${error ? 'border-red-500 ring-1 ring-red-500/20' : isFocused ? 'border-indigo-500 ring-4 ring-indigo-500/10' : 'border-neutral-200'}
                        ${Icon ? 'pl-11' : 'pl-4'} pr-4 py-2.5
                        bg-white placeholder-neutral-400
                        transition-all duration-200 outline-none
                        ${className}
                    `}
                    {...props}
                />

            </div>
            {error && (
                <motion.p
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-1.5 text-xs font-medium text-red-600 ml-1"
                >
                    {error}
                </motion.p>
            )}
        </div>
    );
};

export default Input;
