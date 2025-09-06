'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function MainPage() {
    const router = useRouter();

    useEffect(() => {
        // Redirect to chat page as the main page
        router.push('/chat');
    }, [router]);

    return (
        <div className="h-full flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Redirecting to chat...</p>
            </div>
        </div>
    );
}