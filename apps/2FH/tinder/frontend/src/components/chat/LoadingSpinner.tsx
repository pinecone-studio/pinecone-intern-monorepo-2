"use client";

import React from "react";

interface LoadingSpinnerProps {
    size?: "sm" | "md" | "lg";
    message?: string;
    className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = "md",
    message = "Loading...",
    className = ""
}) => {
    const sizeClasses = {
        sm: "h-6 w-6",
        md: "h-12 w-12",
        lg: "h-16 w-16"
    };

    const textSizes = {
        sm: "text-sm",
        md: "text-lg",
        lg: "text-xl"
    };

    return (
        <div className={`flex flex-col items-center justify-center ${className}`}>
            <div className={`animate-spin rounded-full border-b-2 border-pink-500 ${sizeClasses[size]} mb-2`}></div>
            <p className={`text-gray-500 ${textSizes[size]}`}>{message}</p>
        </div>
    );
};

export default LoadingSpinner;