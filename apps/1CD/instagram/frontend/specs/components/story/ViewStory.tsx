// import React from 'react';
// import { render, screen } from '@testing-library/react';
// import '@testing-library/jest-dom';
// import BigStoryCard from '@/app/(main)/_components/ViewStory';
// import { AccountVisibility } from '@/generated';

// type oneUserStoriesType = {
//   userId: {
//     profileImg: string;
//     userName: string;
//     _id: string;
//     accountVisibility: AccountVisibility;
//   };
//   userStories: {
//     story: {
//       _id: string;
//       createdAt?: Date | null;
//       description?: string | null;
//       endDate?: string | null;
//       image?: string | null;
//     };
//   }[];
// }[];

// jest.mock('@/components/ui/carousel', () => ({
//   Carousel: jest.fn(({ children }) => <div data-testid="carousel">{children}</div>),
//   CarouselContent: jest.fn(({ children }) => <div data-testid="carousel-content">{children}</div>),
//   CarouselItem: jest.fn(({ children }) => <div data-testid="carousel-item">{children}</div>),
//   CarouselNext: jest.fn(() => <button data-testid="carousel-next">Next</button>),
//   CarouselPrevious: jest.fn(() => <button data-testid="carousel-prev">Previous</button>),
// }));

// jest.mock('@/components/ui/progress', () => ({
//   Progress: jest.fn(({ value }) => <div data-testid="progress">Progress: {value}%</div>),
// }));

// const mockStories: oneUserStoriesType = [
//   {
//     userId: { profileImg: '/images/profile1.jpg', userName: 'User1', _id: '2', accountVisibility: AccountVisibility.Public },
//     userStories: [{ story: { _id: '1', image: '/images/story1.jpg', createdAt: new Date('2023-01-01'), description: 'Story 1', endDate: '2023-01-02' } }],
//   },
//   {
//     userId: { profileImg: '/images/profile2.jpg', userName: 'User2', _id: '3', accountVisibility: AccountVisibility.Public },
//     userStories: [{ story: { _id: '2', image: '/images/story2.jpg', createdAt: new Date('2023-02-01'), description: 'Story 2', endDate: '2023-02-02' } }],
//   },
// ];

// describe('BigStoryCard Component', () => {
//   it('renders without crashing', () => {
//     render(<BigStoryCard progress={50} oneUserStories={mockStories} />);

//     expect(screen.getByTestId('carousel')).toBeInTheDocument();
//     expect(screen.getByTestId('carousel-content')).toBeInTheDocument();
//   });

//   it('displays the correct number of stories', () => {
//     render(<BigStoryCard progress={50} oneUserStories={mockStories} />);

//     const carouselItems = screen.getAllByTestId('carousel-item');
//     expect(carouselItems.length).toBe(mockStories.length);
//   });

//   it('renders progress bar with correct value', () => {
//     render(<BigStoryCard progress={75} oneUserStories={mockStories} />);

//     expect(screen.getByTestId('progress')).toHaveTextContent('Progress: 75%');
//   });

//   it('displays user profile image and name', () => {
//     render(<BigStoryCard progress={50} oneUserStories={mockStories} />);

//     // expect(screen.getByAltText('@shadcn')).toHaveAttribute('src', '/images/profile1.jpg');
//     expect(screen.getByText('User1')).toBeInTheDocument();
//   });

//   //   it('renders the correct story background image', () => {
//   //     render(<BigStoryCard progress={50} oneUserStories={mockStories} />);

//   //     const firstItem = screen.getAllByTestId('carousel-item')[0];
//   //     expect(firstItem).toHaveStyle(`background-image: url(/images/story1.jpg)`);
//   //   });

//   it('renders next and previous buttons', () => {
//     render(<BigStoryCard progress={50} oneUserStories={mockStories} />);

//     expect(screen.getByTestId('carousel-next')).toBeInTheDocument();
//     expect(screen.getByTestId('carousel-prev')).toBeInTheDocument();
//   });
// });
