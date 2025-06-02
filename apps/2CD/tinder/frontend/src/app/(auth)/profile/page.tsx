
'use client';
import { useUser } from '@clerk/nextjs';

const ProfilePage = () => {
    const { user, isLoaded } = useUser();

    if (!isLoaded) return <div>Loading...</div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">Hi, {user?.firstName ?? 'friend'} 👋</h1>
            <p>Email: {user?.primaryEmailAddress?.emailAddress}</p>
            <p>ID: {user?.id}</p>
        </div>
    );
}

export default ProfilePage;