'use client';

import { useMemo } from 'react';
import { Profile } from '../../generated';

interface FilteredProfiles {
    filteredProfiles: Profile[];
    hasMoreProfiles: boolean;
}

/**
 * Hook that filters profiles based on user's interestedIn preference
 * - If interestedIn = "male", shows only male profiles
 * - If interestedIn = "female", shows only female profiles  
 * - If interestedIn = "both", shows both male and female profiles
 */
export const useProfileFilter = (
    profiles: Profile[],
    currentUserId: string,
    userInterestedIn: string
): FilteredProfiles => {
    return useMemo((): FilteredProfiles => {
        if (!profiles || profiles.length === 0) {
            return {
                filteredProfiles: [],
                hasMoreProfiles: false
            };
        }

        // Filter out current user's profile
        const otherProfiles = profiles.filter(profile => profile.userId !== currentUserId);

        // Filter based on interestedIn preference
        let filteredProfiles: Profile[] = [];

        switch (userInterestedIn?.toLowerCase()) {
            case 'male':
                filteredProfiles = otherProfiles.filter(profile =>
                    profile.gender?.toLowerCase() === 'male'
                );
                break;
            case 'female':
                filteredProfiles = otherProfiles.filter(profile =>
                    profile.gender?.toLowerCase() === 'female'
                );
                break;
            case 'both':
                filteredProfiles = otherProfiles.filter(profile =>
                    profile.gender?.toLowerCase() === 'male' ||
                    profile.gender?.toLowerCase() === 'female'
                );
                break;
            default:
                // If interestedIn is not set or invalid, show all profiles
                filteredProfiles = otherProfiles;
                break;
        }

        return {
            filteredProfiles,
            hasMoreProfiles: filteredProfiles.length > 0
        };
    }, [profiles, currentUserId, userInterestedIn]);
};