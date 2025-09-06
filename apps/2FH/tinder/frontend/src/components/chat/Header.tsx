"use client";

import React from "react";
import LoadingSpinner from "./LoadingSpinner";
import { useUser } from "@/contexts";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

interface HeaderProps {
    currentUserProfile?: {
        name?: string;
        images?: string[];
        work?: string;
    } | null;
    profileLoading?: boolean;
    onProfileClick?: () => void;
}

interface UserProfileSectionProps {
    currentUserProfile?: {
        name?: string;
        images?: string[];
        work?: string;
    } | null;
    profileLoading?: boolean;
    onProfileClick?: () => void;
}

const UserProfileSection: React.FC<UserProfileSectionProps> = ({
    currentUserProfile,
    profileLoading,
    onProfileClick
}) => (
    <div
        className="flex items-center gap-3 cursor-pointer hover:bg-white/10 rounded-lg p-2 transition-colors"
        onClick={onProfileClick}
    >
        <div className="w-12 h-12 rounded-full overflow-hidden">
            {profileLoading ? (
                <div className="w-full h-full bg-white/20 flex items-center justify-center">
                    <LoadingSpinner size="md" message="" className="text-white" />
                </div>
            ) : (
                <img
                    src={currentUserProfile?.images?.[0] || "https://via.placeholder.com/40"}
                    alt={currentUserProfile?.name || "User Profile"}
                    className="w-full h-full object-cover"
                />
            )}
        </div>
        <div className="flex flex-col">
            <span className="text-white font-medium text-lg">
                {profileLoading ? "Loading..." : currentUserProfile?.name || "You"}
            </span>
            {currentUserProfile?.work && (
                <span className="text-white/80 text-sm">
                    {currentUserProfile.work}
                </span>
            )}
        </div>
    </div>
);


const Header: React.FC<HeaderProps> = ({ currentUserProfile, profileLoading, onProfileClick }) => {
    const { logout } = useUser();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push('/signin');
    };

    return (
        <div className="bg-gradient-to-r from-pink-500 to-red-500 px-4 py-3 pb-5 flex items-center justify-between">
            <UserProfileSection
                currentUserProfile={currentUserProfile}
                profileLoading={profileLoading}
                onProfileClick={onProfileClick}
            />
            <button
                onClick={handleLogout}
                className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                title="Logout"
            >
                <LogOut size={20} />
            </button>
        </div>
    );
};

export default Header;