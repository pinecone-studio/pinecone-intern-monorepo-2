import React from 'react';
import { render, screen } from '@testing-library/react';
import { ProfileFilterExample } from '../../../src/components/profile/ProfileFilterExample';
import { Profile } from '../../../src/generated';

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
    }
];

describe('ProfileFilterExample', () => {
    const currentUserId = 'currentUser';

    it('should render filtered profiles when user is interested in males', () => {
        render(
            <ProfileFilterExample
                profiles={mockProfiles}
                currentUserId={currentUserId}
                userInterestedIn="male"
            />
        );

        expect(screen.getByText((content, element) => {
            return element?.textContent === 'User interested in: male';
        })).toBeInTheDocument();
        expect(screen.getByText((content, element) => {
            return element?.textContent === 'Total profiles found: 1';
        })).toBeInTheDocument();
        expect(screen.getByText((content, element) => {
            return element?.textContent === 'Has more profiles: Yes';
        })).toBeInTheDocument();
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Gender: male')).toBeInTheDocument();
    });

    it('should render filtered profiles when user is interested in females', () => {
        render(
            <ProfileFilterExample
                profiles={mockProfiles}
                currentUserId={currentUserId}
                userInterestedIn="female"
            />
        );

        expect(screen.getByText((content, element) => {
            return element?.textContent === 'User interested in: female';
        })).toBeInTheDocument();
        expect(screen.getByText((content, element) => {
            return element?.textContent === 'Total profiles found: 1';
        })).toBeInTheDocument();
        expect(screen.getByText((content, element) => {
            return element?.textContent === 'Has more profiles: Yes';
        })).toBeInTheDocument();
        expect(screen.getByText('Jane Doe')).toBeInTheDocument();
        expect(screen.getByText('Gender: female')).toBeInTheDocument();
    });

    it('should render all profiles when user is interested in both', () => {
        render(
            <ProfileFilterExample
                profiles={mockProfiles}
                currentUserId={currentUserId}
                userInterestedIn="both"
            />
        );

        expect(screen.getByText((content, element) => {
            return element?.textContent === 'User interested in: both';
        })).toBeInTheDocument();
        expect(screen.getByText((content, element) => {
            return element?.textContent === 'Total profiles found: 2';
        })).toBeInTheDocument();
        expect(screen.getByText((content, element) => {
            return element?.textContent === 'Has more profiles: Yes';
        })).toBeInTheDocument();
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    });

    it('should show no profiles message when no profiles match', () => {
        render(
            <ProfileFilterExample
                profiles={[]}
                currentUserId={currentUserId}
                userInterestedIn="male"
            />
        );

        expect(screen.getByText((content, element) => {
            return element?.textContent === 'Total profiles found: 0';
        })).toBeInTheDocument();
        expect(screen.getByText((content, element) => {
            return element?.textContent === 'Has more profiles: No';
        })).toBeInTheDocument();
        expect(screen.getByText('No profiles match your preferences')).toBeInTheDocument();
        expect(screen.getByText('Try adjusting your interestedIn setting')).toBeInTheDocument();
    });

    it('should exclude current user profile from results', () => {
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

        render(
            <ProfileFilterExample
                profiles={profilesWithCurrentUser}
                currentUserId={currentUserId}
                userInterestedIn="male"
            />
        );

        expect(screen.getByText((content, element) => {
            return element?.textContent === 'Total profiles found: 1';
        })).toBeInTheDocument();
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.queryByText('Current User')).not.toBeInTheDocument();
    });
});