"use client";

import React from "react";

interface ErrorMessageProps {
    message?: string;
    error?: string;
    className?: string;
    onRetry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
    message = "Something went wrong",
    error,
    className = "",
    onRetry
}) => {
    return (
        <div className={`flex flex-col items-center justify-center text-center ${className}`}>
            <div className="text-6xl mb-4">⚠️</div>
            <p className="text-xl text-red-500 mb-2">{message}</p>
            {error && (
                <p className="text-sm text-gray-500 mb-4">{error}</p>
            )}
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                >
                    Try Again
                </button>
            )}
        </div>
    );
};

export default ErrorMessage;