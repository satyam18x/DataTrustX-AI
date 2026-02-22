import React from 'react';

const LoadingSkeleton = ({ className = '', count = 1, type = 'text' }) => {
    const skeletons = Array(count).fill(null);

    const types = {
        text: 'h-4 w-full rounded',
        title: 'h-8 w-3/4 rounded',
        avatar: 'h-12 w-12 rounded-full',
        card: 'h-48 w-full rounded-xl',
        button: 'h-10 w-32 rounded-lg',
    };

    return (
        <div className="space-y-3">
            {skeletons.map((_, index) => (
                <div
                    key={index}
                    className={`shimmer ${types[type]} ${className}`}
                />
            ))}
        </div>
    );
};

export default LoadingSkeleton;
