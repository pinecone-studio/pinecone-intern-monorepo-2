// import React from 'react';
// import { render, screen } from '@testing-library/react';
// import '@testing-library/jest-dom';
// import StoryCard from '@/components/StoryCard';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// jest.mock('@/components/ui/avatar', () => ({
//   Avatar: jest.fn(({ children }) => <div data-testid="avatar">{children}</div>),
//   AvatarImage: jest.fn(({ src, alt }) => <img data-testid="avatar-image" src={src} alt={alt} />),
//   AvatarFallback: jest.fn(({ children }) => <div data-testid="avatar-fallback">{children}</div>),
// }));

// describe('StoryCard Component', () => {
//   it('renders without crashing', () => {
//     render(<StoryCard />);
//     expect(screen.getByTestId('avatar')).toBeInTheDocument();
//   });

//   it('displays the correct background image', () => {
//     render(<StoryCard />);
//     const storyCard = screen.getByTestId('avatar').closest('div');
//     expect(storyCard).toHaveStyle("background-image: url('/images/img1.avif')");
//   });

//   it('renders the avatar image with correct props', () => {
//     render(<StoryCard />);
//     const avatarImage = screen.getByTestId('avatar-image');
//     expect(avatarImage).toHaveAttribute('src', 'https://github.com/shadcn.png');
//     expect(avatarImage).toHaveAttribute('alt', '@shadcn');
//   });

//   it('renders fallback content if avatar image fails', () => {
//     render(<StoryCard />);
//     const avatarFallback = screen.getByTestId('avatar-fallback');
//     expect(avatarFallback).toHaveTextContent('CN');
//   });

//   it('displays the username and time correctly', () => {
//     render(<StoryCard />);
//     expect(screen.getByText('username')).toBeInTheDocument();
//     expect(screen.getByText('5h')).toBeInTheDocument();
//   });
// });
