"use client";

import React, { useState } from "react";
import { X, Edit3, Save, User, Camera, Heart, MapPin, Briefcase, Calendar } from "lucide-react";
import LoadingSpinner from "./LoadingSpinner";
import ProfileEdit from "./ProfileEdit";
import ProfilePhotosEditor from "./ProfilePhotosEditor";

interface ProfilePreviewModalProps {
    onClose: () => void;
    profile?: {
        name?: string;
        images?: string[];
        work?: string;
        bio?: string;
        age?: number;
        location?: string;
        interests?: string[];
        profession?: string;
        dateOfBirth?: string;
        interestedIn?: string;
    } | null;
    profileLoading?: boolean;
    onSave?: (updatedProfile: any) => void;
    userId?: string;
}

const ProfilePreviewModal: React.FC<ProfilePreviewModalProps> = ({
    onClose,
    profile,
    profileLoading,
    onSave,
    userId
}) => {
    const [activeTab, setActiveTab] = useState<'preview' | 'edit' | 'photos'>('preview');
    const [editedProfile, setEditedProfile] = useState(profile);

    React.useEffect(() => {
        setEditedProfile(profile);
    }, [profile]);

    const handleSave = () => {
        if (onSave && editedProfile) {
            onSave(editedProfile);
        }
    };

    const handleProfileUpdate = (updatedProfile: any) => {
        setEditedProfile(prev => ({
            ...prev,
            ...updatedProfile
        }));
        if (onSave) {
            onSave(updatedProfile);
        }
    };

    const handlePhotosUpdate = (images: string[]) => {
        setEditedProfile(prev => ({
            ...prev,
            images
        }));
        if (onSave) {
            onSave({ ...editedProfile, images });
        }
    };

    const calculateAge = (dateOfBirth: string) => {
        if (!dateOfBirth) return null;
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const TabButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({
        active,
        onClick,
        icon,
        label
    }) => (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${active
                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg'
                : 'text-gray-600 hover:text-pink-600 hover:bg-pink-50'
                }`}
        >
            {icon}
            <span className="hidden sm:inline">{label}</span>
        </button>
    );

    return (
        <div className="w-full h-full bg-gradient-to-br from-gray-50 to-white overflow-y-auto">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
                {/* Tab Navigation */}
                <div className="flex gap-2 mt-4">
                    <TabButton
                        active={activeTab === 'preview'}
                        onClick={() => setActiveTab('preview')}
                        icon={<User className="w-4 h-4" />}
                        label="Preview"
                    />
                    <TabButton
                        active={activeTab === 'edit'}
                        onClick={() => setActiveTab('edit')}
                        icon={<Edit3 className="w-4 h-4" />}
                        label="Edit Info"
                    />
                    <TabButton
                        active={activeTab === 'photos'}
                        onClick={() => setActiveTab('photos')}
                        icon={<Camera className="w-4 h-4" />}
                        label="Edit Photos"
                    />
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                {profileLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <LoadingSpinner size="md" message="Loading profile..." />
                    </div>
                ) : (
                    <div className="max-w-4xl mx-auto">
                        {activeTab === 'preview' && (
                            <div className="space-y-8">
                                {/* Profile Header */}
                                <div className="bg-white rounded-2xl shadow-lg p-8">
                                    <div className="flex flex-col lg:flex-row gap-8">
                                        {/* Profile Image */}
                                        <div className="flex-shrink-0">
                                            <div className="w-48 h-48 rounded-2xl overflow-hidden shadow-lg">
                                                {editedProfile?.images?.[0] ? (
                                                    <img
                                                        src={editedProfile.images[0]}
                                                        alt="Profile"
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gradient-to-br from-pink-100 to-rose-100 flex items-center justify-center">
                                                        <User className="w-16 h-16 text-pink-400" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Profile Info */}
                                        <div className="flex-1 space-y-4">
                                            <div>
                                                <h1 className="text-3xl font-bold text-gray-900">
                                                    {editedProfile?.name || 'No name'}
                                                </h1>
                                                {editedProfile?.dateOfBirth && (
                                                    <p className="text-xl text-gray-600">
                                                        {calculateAge(editedProfile.dateOfBirth)} years old
                                                    </p>
                                                )}
                                            </div>

                                            {editedProfile?.bio && (
                                                <p className="text-gray-700 text-lg leading-relaxed">
                                                    {editedProfile.bio}
                                                </p>
                                            )}

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {editedProfile?.profession && (
                                                    <div className="flex items-center gap-3">
                                                        <Briefcase className="w-5 h-5 text-pink-500" />
                                                        <span className="text-gray-700">{editedProfile.profession}</span>
                                                    </div>
                                                )}
                                                {editedProfile?.work && (
                                                    <div className="flex items-center gap-3">
                                                        <MapPin className="w-5 h-5 text-pink-500" />
                                                        <span className="text-gray-700">{editedProfile.work}</span>
                                                    </div>
                                                )}
                                                {editedProfile?.interestedIn && (
                                                    <div className="flex items-center gap-3">
                                                        <Heart className="w-5 h-5 text-pink-500" />
                                                        <span className="text-gray-700">Interested in {editedProfile.interestedIn}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {editedProfile?.interests && editedProfile.interests.length > 0 && (
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Interests</h3>
                                                    <div className="flex flex-wrap gap-2">
                                                        {editedProfile.interests.map((interest, index) => (
                                                            <span
                                                                key={index}
                                                                className="px-3 py-1 bg-gradient-to-r from-pink-100 to-rose-100 text-pink-700 rounded-full text-sm font-medium"
                                                            >
                                                                {interest}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Photo Gallery */}
                                {editedProfile?.images && editedProfile.images.length > 1 && (
                                    <div className="bg-white rounded-2xl shadow-lg p-8">
                                        <h3 className="text-2xl font-bold text-gray-900 mb-6">Photos</h3>
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                            {editedProfile.images.slice(1).map((image, index) => (
                                                <div key={index} className="aspect-square rounded-xl overflow-hidden shadow-md">
                                                    <img
                                                        src={image}
                                                        alt={`Profile ${index + 2}`}
                                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'edit' && (
                            <div className="bg-white rounded-2xl shadow-lg p-8">
                                <ProfileEdit
                                    initial={editedProfile || undefined}
                                    onSubmit={handleProfileUpdate}
                                    userId={userId}
                                />
                            </div>
                        )}

                        {activeTab === 'photos' && (
                            <div className="w-full h-fit flex justify-center items-center">
                                <ProfilePhotosEditor
                                    initialImages={editedProfile?.images || []}
                                    onChange={handlePhotosUpdate}
                                    userId={userId}
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePreviewModal;