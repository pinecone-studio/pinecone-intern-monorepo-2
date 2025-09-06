import { renderHook } from '@testing-library/react';
import { useProfileFilter } from '../../../src/components/profile/ProfileFilter';
import { Profile } from '../../../src/generated';

// Mock Profile data
const mockProfiles: Profile[] = [
    {
        id: '1',
        userId: 'user1',
        name: 'John Doe',
        gender: 'male',
        interestedIn: 'female',
        bio: 'Test bio',
        interests: ['music'],
        profession: 'Engineer',
        work: 'Tech Company',
        images: ['image1.jpg'],
        dateOfBirth: '1990-01-01',
        createdAt: new Date(),
        updatedAt: new Date(),
        likes: [],
        matches: []
    },
    {
        id: '2',
        userId: 'user2',
        name: 'Jane Doe',
        gender: 'female',
        interestedIn: 'male',
        bio: 'Test bio',
        interests: ['art'],
        profession: 'Designer',
        work: 'Design Company',
        images: ['image2.jpg'],
        dateOfBirth: '1992-01-01',
        createdAt: new Date(),
        updatedAt: new Date(),
        likes: [],
        matches: []
    },
    {
        id: '3',
        userId: 'user3',
        name: 'Alex Smith',
        gender: 'male',
        interestedIn: 'both',
        bio: 'Test bio',
        interests: ['sports'],
        profession: 'Teacher',
        work: 'School',
        images: ['image3.jpg'],
        dateOfBirth: '1988-01-01',
        createdAt: new Date(),
        updatedAt: new Date(),
        likes: [],
        matches: []
    }
];

describe('useProfileFilter', () => {
    const currentUserId = 'currentUser';

    describe('when user is interested in males', () => {
        it('should return only male profiles', () => {
            const { result } = renderHook(() =>
                useProfileFilter(mockProfiles, currentUserId, 'male')
            );

            expect(result.current.filteredProfiles).toHaveLength(2);
            expect(result.current.filteredProfiles.every(profile => profile.gender === 'male')).toBe(true);
            expect(result.current.hasMoreProfiles).toBe(true);
        });
    });

    describe('when user is interested in females', () => {
        it('should return only female profiles', () => {
            const { result } = renderHook(() =>
                useProfileFilter(mockProfiles, currentUserId, 'female')
            );

            expect(result.current.filteredProfiles).toHaveLength(1);
            expect(result.current.filteredProfiles[0].gender).toBe('female');
            expect(result.current.hasMoreProfiles).toBe(true);
        });
    });

    describe('when user is interested in both', () => {
        it('should return both male and female profiles', () => {
            const { result } = renderHook(() =>
                useProfileFilter(mockProfiles, currentUserId, 'both')
            );

            expect(result.current.filteredProfiles).toHaveLength(3);
            expect(result.current.hasMoreProfiles).toBe(true);
        });
    });

    describe('when user is interested in invalid value', () => {
        it('should return all profiles', () => {
            const { result } = renderHook(() =>
                useProfileFilter(mockProfiles, currentUserId, 'invalid')
            );

            expect(result.current.filteredProfiles).toHaveLength(3);
            expect(result.current.hasMoreProfiles).toBe(true);
        });
    });

    describe('when profiles array is empty', () => {
        it('should return empty array', () => {
            const { result } = renderHook(() =>
                useProfileFilter([], currentUserId, 'male')
            );

            expect(result.current.filteredProfiles).toHaveLength(0);
            expect(result.current.hasMoreProfiles).toBe(false);
        });
    });

    describe('when profiles is null or undefined', () => {
        it('should return empty array', () => {
            const { result } = renderHook(() =>
                useProfileFilter(null as any, currentUserId, 'male')
            );

            expect(result.current.filteredProfiles).toHaveLength(0);
            expect(result.current.hasMoreProfiles).toBe(false);
        });
    });

    describe('when current user profile is in the list', () => {
        it('should exclude current user profile', () => {
            const profilesWithCurrentUser = [
                ...mockProfiles,
                {
                    id: 'current',
                    userId: currentUserId,
                    name: 'Current User',
                    gender: 'male',
                    interestedIn: 'female',
                    bio: 'Test bio',
                    interests: ['music'],
                    profession: 'Engineer',
                    work: 'Tech Company',
                    images: ['image1.jpg'],
                    dateOfBirth: '1990-01-01',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    likes: [],
                    matches: []
                }
            ];

            const { result } = renderHook(() =>
                useProfileFilter(profilesWithCurrentUser, currentUserId, 'male')
            );

            expect(result.current.filteredProfiles).toHaveLength(2);
            expect(result.current.filteredProfiles.every(profile => profile.userId !== currentUserId)).toBe(true);
        });
    });
});