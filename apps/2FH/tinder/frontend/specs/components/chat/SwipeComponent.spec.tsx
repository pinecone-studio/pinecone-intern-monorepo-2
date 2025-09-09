import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import SwipeComponent from '../../../src/components/chat/SwipeComponent';
import { AuthProvider } from '../../../src/contexts/AuthContext';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
        button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    },
    useMotionValue: () => ({ get: () => 0, set: jest.fn() }),
    useTransform: () => ({ get: () => 0 }),
    PanInfo: {},
}));

// Mock ProfileCard component
jest.mock('../../../src/components/match/ProfileCard', () => ({
    ProfileCard: ({ profile, onDislike, onLike, onSuperLike, onRewind, onBoost, className }: any) => (
        <div data-testid="profile-card" className={className}>
            <div data-testid="profile-name">{profile.name}</div>
            <div data-testid="profile-age">{profile.age || 'N/A'} yrs</div>
            <div data-testid="profile-work">{profile.work}</div>
            <div data-testid="profile-location">{profile.location}</div>
            <div data-testid="profile-bio">{profile.bio}</div>
            <div data-testid="profile-interests">
                {profile.interests?.map((interest: string, index: number) => (
                    <span key={index} data-testid={`interest-${index}`}>{interest}</span>
                ))}
            </div>
            <button data-testid="dislike-button" onClick={onDislike}>Dislike</button>
            <button data-testid="like-button" onClick={onLike}>Like</button>
            <button data-testid="super-like-button" onClick={onSuperLike}>Super Like</button>
            {onRewind && <button data-testid="rewind-button" onClick={onRewind}>Rewind</button>}
            {onBoost && <button data-testid="boost-button" onClick={onBoost}>Boost</button>}
        </div>
    ),
}));

const mockMatches = [
    {
        id: 1,
        name: 'John Doe',
        dateOfBirth: '1998-01-01',
        images: [
            'https://via.placeholder.com/400',
            'https://via.placeholder.com/400?text=Image2',
            'https://via.placeholder.com/400?text=Image3'
        ],
        work: 'Software Engineer',
        location: 'New York',
        bio: 'Love hiking and coding',
        interests: ['Hiking', 'Coding', 'Photography']
    },
    {
        id: 2,
        name: 'Jane Smith',
        dateOfBirth: '1995-01-01',
        images: [
            'https://via.placeholder.com/400?text=Jane1',
            'https://via.placeholder.com/400?text=Jane2'
        ],
        work: 'Designer',
        location: 'San Francisco',
        bio: 'Creative soul who loves art',
        interests: ['Art', 'Music', 'Travel']
    },
    {
        id: 3,
        name: 'Mike Johnson',
        dateOfBirth: '1993-01-01',
        images: ['https://via.placeholder.com/400?text=Mike1'],
        work: 'Teacher',
        location: 'Chicago',
        bio: 'Passionate about education',
        interests: ['Education', 'Reading', 'Cooking']
    }
];

describe('SwipeComponent', () => {
    const mockOnClose = jest.fn();
    const mockOnMatchClick = jest.fn();
    const mockOnSwipe = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders without crashing', () => {
        render(
            <SwipeComponent
                onClose={mockOnClose}
                matches={mockMatches}
                onMatchClick={mockOnMatchClick}
                onSwipe={mockOnSwipe}
            />
        );

        expect(screen.getByText('Discover')).toBeInTheDocument();
    });

    it('displays the first match by default', () => {
        render(
            <SwipeComponent
                onClose={mockOnClose}
                matches={mockMatches}
                onMatchClick={mockOnMatchClick}
                onSwipe={mockOnSwipe}
            />
        );

        expect(screen.getByTestId('profile-name')).toHaveTextContent('John Doe');
        expect(screen.getByTestId('profile-work')).toHaveTextContent('Software Engineer');
        expect(screen.getByTestId('profile-location')).toHaveTextContent('New York');
        expect(screen.getByTestId('profile-bio')).toHaveTextContent('Love hiking and coding');
    });

    it('displays interests as tags', () => {
        render(
            <SwipeComponent
                onClose={mockOnClose}
                matches={mockMatches}
                onMatchClick={mockOnMatchClick}
                onSwipe={mockOnSwipe}
            />
        );

        expect(screen.getByTestId('interest-0')).toHaveTextContent('Hiking');
        expect(screen.getByTestId('interest-1')).toHaveTextContent('Coding');
        expect(screen.getByTestId('interest-2')).toHaveTextContent('Photography');
    });

    it('shows card counter', () => {
        render(
            <SwipeComponent
                onClose={mockOnClose}
                matches={mockMatches}
                onMatchClick={mockOnMatchClick}
                onSwipe={mockOnSwipe}
            />
        );

        expect(screen.getByText('1 / 3')).toBeInTheDocument();
    });

    it('handles swipe left action', async () => {
        render(
            <SwipeComponent
                onClose={mockOnClose}
                matches={mockMatches}
                onMatchClick={mockOnMatchClick}
                onSwipe={mockOnSwipe}
            />
        );

        const dislikeButton = screen.getByTestId('dislike-button');
        fireEvent.click(dislikeButton);

        await waitFor(() => {
            expect(mockOnSwipe).toHaveBeenCalledWith('left', mockMatches[0]);
        });
    });

    it('handles swipe right action', async () => {
        render(
            <SwipeComponent
                onClose={mockOnClose}
                matches={mockMatches}
                onMatchClick={mockOnMatchClick}
                onSwipe={mockOnSwipe}
            />
        );

        const likeButton = screen.getByTestId('like-button');
        fireEvent.click(likeButton);

        await waitFor(() => {
            expect(mockOnSwipe).toHaveBeenCalledWith('right', mockMatches[0]);
        });
    });

    it('handles super like action', async () => {
        render(
            <SwipeComponent
                onClose={mockOnClose}
                matches={mockMatches}
                onMatchClick={mockOnMatchClick}
                onSwipe={mockOnSwipe}
            />
        );

        const superLikeButton = screen.getByTestId('super-like-button');
        fireEvent.click(superLikeButton);

        await waitFor(() => {
            expect(mockOnSwipe).toHaveBeenCalledWith('right', mockMatches[0]);
        });
    });

    it('handles close action', () => {
        render(
            <SwipeComponent
                onClose={mockOnClose}
                matches={mockMatches}
                onMatchClick={mockOnMatchClick}
                onSwipe={mockOnSwipe}
            />
        );

        const closeButton = screen.getByRole('button', { name: /close/i });
        fireEvent.click(closeButton);

        expect(mockOnClose).toHaveBeenCalled();
    });

    it('displays empty state when no matches', () => {
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

    it('displays empty state when matches is undefined', () => {
        render(
            <SwipeComponent
                onClose={mockOnClose}
                onMatchClick={mockOnMatchClick}
                onSwipe={mockOnSwipe}
            />
        );

        expect(screen.getByText('No more profiles')).toBeInTheDocument();
    });

    it('cycles through matches correctly', async () => {
        render(
            <SwipeComponent
                onClose={mockOnClose}
                matches={mockMatches}
                onMatchClick={mockOnMatchClick}
                onSwipe={mockOnSwipe}
            />
        );

        // Start with first match
        expect(screen.getByTestId('profile-name')).toHaveTextContent('John Doe');

        // Swipe to next match
        const likeButton = screen.getByTestId('like-button');
        fireEvent.click(likeButton);

        await waitFor(() => {
            expect(screen.getByTestId('profile-name')).toHaveTextContent('Jane Smith');
            expect(screen.getByText('2 / 3')).toBeInTheDocument();
        });
    });

    it('resets to first match when reaching the end', async () => {
        render(
            <SwipeComponent
                onClose={mockOnClose}
                matches={mockMatches}
                onMatchClick={mockOnMatchClick}
                onSwipe={mockOnSwipe}
            />
        );

        // Swipe through all matches
        const likeButton = screen.getByTestId('like-button');

        // First swipe
        fireEvent.click(likeButton);
        await waitFor(() => {
            expect(screen.getByTestId('profile-name')).toHaveTextContent('Jane Smith');
        });

        // Second swipe
        fireEvent.click(likeButton);
        await waitFor(() => {
            expect(screen.getByTestId('profile-name')).toHaveTextContent('Mike Johnson');
        });

        // Third swipe should reset to first
        fireEvent.click(likeButton);
        await waitFor(() => {
            expect(screen.getByTestId('profile-name')).toHaveTextContent('John Doe');
            expect(screen.getByText('1 / 3')).toBeInTheDocument();
        });
    });

    it('handles matches without optional fields', () => {
        const minimalMatch = {
            id: 1,
            name: 'Minimal User',
            dateOfBirth: '1998-01-01',
            images: ['https://via.placeholder.com/400']
        };

        render(
            <SwipeComponent
                onClose={mockOnClose}
                matches={[minimalMatch]}
                onMatchClick={mockOnMatchClick}
                onSwipe={mockOnSwipe}
            />
        );

        expect(screen.getByTestId('profile-name')).toHaveTextContent('Minimal User');
        expect(screen.queryByTestId('profile-work')).not.toBeInTheDocument();
    });

    it('handles matches with missing images', () => {
        const matchWithoutImages = {
            id: 1,
            name: 'No Images User',
            dateOfBirth: '1998-01-01'
        };

        render(
            <SwipeComponent
                onClose={mockOnClose}
                matches={[matchWithoutImages]}
                onMatchClick={mockOnMatchClick}
                onSwipe={mockOnSwipe}
            />
        );

        expect(screen.getByTestId('profile-name')).toHaveTextContent('No Images User');
    });

    it('tracks swiped profiles correctly', async () => {
        render(
            <SwipeComponent
                onClose={mockOnClose}
                matches={mockMatches}
                onMatchClick={mockOnMatchClick}
                onSwipe={mockOnSwipe}
            />
        );

        const likeButton = screen.getByTestId('like-button');
        fireEvent.click(likeButton);

        await waitFor(() => {
            expect(mockOnSwipe).toHaveBeenCalledWith('right', mockMatches[0]);
        });
    });

});