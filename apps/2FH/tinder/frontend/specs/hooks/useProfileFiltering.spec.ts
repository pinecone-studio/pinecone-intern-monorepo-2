import { renderHook } from '@testing-library/react';
import { useProfileFiltering } from '../../src/hooks/useProfileFiltering';
import { useProfileData } from '../../src/hooks/useProfileData';

// Mock the useProfileData hook
jest.mock('../../src/hooks/useProfileData');
const mockUseProfileData = useProfileData as jest.MockedFunction<typeof useProfileData>;

describe('useProfileFiltering', () => {
    const currentUserId = 'currentUser';

    const mockProfiles = [
        {
            id: '1',
            userId: 'user1',
            gender: 'male',
            interestedIn: 'female',
            name: 'John Doe',
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
            gender: 'female',
            interestedIn: 'male',
            name: 'Jane Doe',
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
            gender: 'male',
            interestedIn: 'both',
            name: 'Alex Smith',
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

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('when user is interested in males', () => {
        it('should filter profiles to show only males', () => {
            mockUseProfileData.mockReturnValue({
                profilesData: {
                    getAllProfiles: mockProfiles
                },
                userProfileData: {
                    getProfile: {
                        interestedIn: 'male'
                    }
                },
                loading: false,
                userLoading: false,
                error: null,
                userError: null,
                refetch: jest.fn()
            });

            const { result } = renderHook(() => useProfileFiltering(currentUserId));

            expect(result.current.profiles).toHaveLength(2);
            expect(result.current.profiles.every(profile => profile.gender === 'male')).toBe(true);
        });
    });

    describe('when user is interested in females', () => {
        it('should filter profiles to show only females', () => {
            mockUseProfileData.mockReturnValue({
                profilesData: {
                    getAllProfiles: mockProfiles
                },
                userProfileData: {
                    getProfile: {
                        interestedIn: 'female'
                    }
                },
                loading: false,
                userLoading: false,
                error: null,
                userError: null,
                refetch: jest.fn()
            });

            const { result } = renderHook(() => useProfileFiltering(currentUserId));

            expect(result.current.profiles).toHaveLength(1);
            expect(result.current.profiles[0].gender).toBe('female');
        });
    });

    describe('when user is interested in both', () => {
        it('should filter profiles to show both males and females', () => {
            mockUseProfileData.mockReturnValue({
                profilesData: {
                    getAllProfiles: mockProfiles
                },
                userProfileData: {
                    getProfile: {
                        interestedIn: 'both'
                    }
                },
                loading: false,
                userLoading: false,
                error: null,
                userError: null,
                refetch: jest.fn()
            });

            const { result } = renderHook(() => useProfileFiltering(currentUserId));

            expect(result.current.profiles).toHaveLength(3);
        });
    });

    describe('when user interestedIn is not set', () => {
        it('should return empty array', () => {
            mockUseProfileData.mockReturnValue({
                profilesData: {
                    getAllProfiles: mockProfiles
                },
                userProfileData: {
                    getProfile: {
                        interestedIn: null
                    }
                },
                loading: false,
                userLoading: false,
                error: null,
                userError: null,
                refetch: jest.fn()
            });

            const { result } = renderHook(() => useProfileFiltering(currentUserId));

            expect(result.current.profiles).toHaveLength(0);
        });
    });

    describe('when profiles data is not available', () => {
        it('should return empty array', () => {
            mockUseProfileData.mockReturnValue({
                profilesData: null,
                userProfileData: {
                    getProfile: {
                        interestedIn: 'male'
                    }
                },
                loading: false,
                userLoading: false,
                error: null,
                userError: null,
                refetch: jest.fn()
            });

            const { result } = renderHook(() => useProfileFiltering(currentUserId));

            expect(result.current.profiles).toHaveLength(0);
        });
    });

    describe('when user profile data is not available', () => {
        it('should return empty array', () => {
            mockUseProfileData.mockReturnValue({
                profilesData: {
                    getAllProfiles: mockProfiles
                },
                userProfileData: null,
                loading: false,
                userLoading: false,
                error: null,
                userError: null,
                refetch: jest.fn()
            });

            const { result } = renderHook(() => useProfileFiltering(currentUserId));

            expect(result.current.profiles).toHaveLength(0);
        });
    });

    describe('when current user profile is in the list', () => {
        it('should exclude current user profile', () => {
            const profilesWithCurrentUser = [
                ...mockProfiles,
                {
                    id: 'current',
                    userId: currentUserId,
                    gender: 'male',
                    interestedIn: 'female',
                    name: 'Current User',
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

            mockUseProfileData.mockReturnValue({
                profilesData: {
                    getAllProfiles: profilesWithCurrentUser
                },
                userProfileData: {
                    getProfile: {
                        interestedIn: 'male'
                    }
                },
                loading: false,
                userLoading: false,
                error: null,
                userError: null,
                refetch: jest.fn()
            });

            const { result } = renderHook(() => useProfileFiltering(currentUserId));

            expect(result.current.profiles).toHaveLength(2);
            expect(result.current.profiles.every(profile => profile.userId !== currentUserId)).toBe(true);
        });
    });
});