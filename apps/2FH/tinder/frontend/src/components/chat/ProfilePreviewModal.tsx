"use client";

import React, { useState } from "react";
import { X, Edit3, Save, Camera } from "lucide-react";
import LoadingSpinner from "./LoadingSpinner";

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
    } | null;
    profileLoading?: boolean;
    onSave?: (updatedProfile: any) => void;
}

const ProfilePreviewModal: React.FC<ProfilePreviewModalProps> = ({
    onClose,
    profile,
    profileLoading,
    onSave
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedProfile, setEditedProfile] = useState(profile);

    React.useEffect(() => {
        setEditedProfile(profile);
    }, [profile]);

    const handleSave = () => {
        if (onSave && editedProfile) {
            onSave(editedProfile);
        }
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditedProfile(profile);
        setIsEditing(false);
    };

    const handleInputChange = (field: string, value: string) => {
        setEditedProfile(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleImageChange = (index: number, value: string) => {
        if (!editedProfile?.images) return;
        const newImages = [...editedProfile.images];
        newImages[index] = value;
        setEditedProfile(prev => ({
            ...prev,
            images: newImages
        }));
    };

    return (
        <div className="w-full h-full bg-white overflow-y-auto">
            {/* Header */}
            <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                    {isEditing ? "Edit Profile" : "Profile Preview"}
                </h2>
                <div className="flex items-center gap-2">
                    {!isEditing ? (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="p-2 text-gray-600 hover:text-pink-600 hover:bg-pink-50 rounded-full transition-colors"
                        >
                            <Edit3 className="w-5 h-5" />
                        </button>
                    ) : (
                        <div className="flex gap-2">
                            <button
                                onClick={handleCancel}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors flex items-center gap-2"
                            >
                                <Save className="w-4 h-4" />
                                Save
                            </button>
                        </div>
                    )}
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                {profileLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <LoadingSpinner size="md" message="Loading profile..." />
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Profile Images */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900">Photos</h3>
                            <div className="grid grid-cols-2 gap-4">
                                {editedProfile?.images?.map((image, index) => (
                                    <div key={index} className="relative group">
                                        <img
                                            src={image}
                                            alt={`Profile ${index + 1}`}
                                            className="w-full h-48 object-cover rounded-xl"
                                        />
                                        {isEditing && (
                                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-2 bg-white rounded-full text-gray-600 hover:text-pink-600">
                                                    <Camera className="w-5 h-5" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )) || (
                                        <div className="col-span-2 flex items-center justify-center h-48 bg-gray-100 rounded-xl">
                                            <span className="text-gray-500">No photos available</span>
                                        </div>
                                    )}
                            </div>
                        </div>

                        {/* Basic Info */}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePreviewModal;