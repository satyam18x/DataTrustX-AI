import React from 'react';

const LoadingSkeleton = ({ className = '', count = 1, type = 'text', layout = 'vertical' }) => {
    const skeletons = Array(count).fill(null);

    const types = {
        text: 'h-4 w-full rounded-md',
        title: 'h-8 w-3/4 rounded-lg',
        avatar: 'h-12 w-12 rounded-full',
        card: 'h-48 w-full rounded-2xl',
        button: 'h-11 w-32 rounded-lg',
    };

    return (
        <div className={`w-full ${layout === 'vertical' ? 'space-y-4' : 'flex flex-wrap gap-4'}`}>
            {skeletons.map((_, index) => (
                <div
                    key={index}
                    className={`animate-shimmer ${types[type]} ${className}`}
                />
            ))}
        </div>
    );
};

export default LoadingSkeleton;

