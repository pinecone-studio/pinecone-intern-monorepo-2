import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SwipeComponent from '../SwipeComponent';
import { Profile } from '../../../generated';

const mockProfiles: Profile[] = [
    {
        id: '1',
        name: 'Test User 1',
        dateOfBirth: '1995-01-01',
        profession: 'Software Engineer',
        bio: 'Test bio 1',
        interests: ['coding', 'music'],
        images: ['https://example.com/image1.jpg'],
        userId: 'user1'
    },
    {
        id: '2',
        name: 'Test User 2',
        dateOfBirth: '1990-05-15',
        profession: 'Designer',
        bio: 'Test bio 2',
        interests: ['art', 'travel'],
        images: ['https://example.com/image2.jpg'],
        userId: 'user2'
    }
];

describe('SwipeComponent', () => {
    const mockOnClose = jest.fn();
    const mockOnMatchClick = jest.fn();
    const mockOnSwipe = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders profiles correctly', () => {
        render(
            <SwipeComponent
                onClose={mockOnClose}
                matches={mockProfiles}
                onMatchClick={mockOnMatchClick}
                onSwipe={mockOnSwipe}
            />
        );

        expect(screen.getByText('Test User 1')).toBeInTheDocument();
        expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    });

    it('shows match modal when right swipe occurs', async () => {
        render(
            <SwipeComponent
                onClose={mockOnClose}
                matches={mockProfiles}
                onMatchClick={mockOnMatchClick}
                onSwipe={mockOnSwipe}
            />
        );

        const likeButton = screen.getByRole('button', { name: /like/i });
        fireEvent.click(likeButton);

        await waitFor(() => {
            expect(screen.getByText("It's a Match!")).toBeInTheDocument();
            expect(screen.getByText('You and Test User 1 liked each other')).toBeInTheDocument();
        });
    });

    it('does not show match modal when left swipe occurs', async () => {
        render(
            <SwipeComponent
                onClose={mockOnClose}
                matches={mockProfiles}
                onMatchClick={mockOnMatchClick}
                onSwipe={mockOnSwipe}
            />
        );

        const dislikeButton = screen.getByRole('button', { name: /dislike/i });
        fireEvent.click(dislikeButton);

        await waitFor(() => {
            expect(screen.queryByText("It's a Match!")).not.toBeInTheDocument();
        });
    });

    it('calls onSwipe when swipe occurs', () => {
        render(
            <SwipeComponent
                onClose={mockOnClose}
                matches={mockProfiles}
                onMatchClick={mockOnMatchClick}
                onSwipe={mockOnSwipe}
            />
        );

        const likeButton = screen.getByRole('button', { name: /like/i });
        fireEvent.click(likeButton);

        expect(mockOnSwipe).toHaveBeenCalledWith('right', mockProfiles[0]);
    });

    it('shows no more profiles message when no profiles available', () => {
        render(
            <SwipeComponent
                onClose={mockOnClose}
                matches={[]}
                onMatchClick={mockOnMatchClick}
                onSwipe={mockOnSwipe}
            />
        );

        expect(screen.getByText('No more profiles')).toBeInTheDocument();
        expect(screen.getByText('Check back later for new matches!')).toBeInTheDocument();
    });
});