"use client";

import React from "react";

interface EmptyStateProps {
    icon?: string;
    title?: string;
    subtitle?: string;
    className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
    icon = "👤",
    title = "No data available",
    subtitle,
    className = ""
}) => {
    return (
        <div className={`flex flex-col items-center justify-center text-center ${className}`}>
            <div className="text-6xl mb-4">{icon}</div>
            <p className="text-xl text-gray-500 mb-2">{title}</p>
            {subtitle && (
                <p className="text-sm text-gray-400">{subtitle}</p>
            )}
        </div>
    );
};

export default EmptyState;