// import { render, screen, fireEvent } from '@testing-library/react';
// import '@testing-library/jest-dom/extend-expect'; // Remove this if not allowed
// import React from 'react';
// import { Header } from '@/app/(main)/_components/Header';

// // Mock `useAuth` hook
// jest.mock('../../components/providers/AuthProvider.tsx', () => ({
//   useAuth: () => ({ user: { profileImg: '/images/profileImg.webp' } }),
// }));

// // Mock `SearchFromAllUsers` and `MenuBar`
// jest.mock('@/app/(main)/_components/SearchComponent', () => () => <div>Search Component</div>);
// jest.mock('./MenuBar', () => ({ MenuBar: () => <div>MenuBar</div> }));

// describe('Header Component', () => {
//   it('should render the Header component correctly', () => {
//     render(<Header />);

//     const header = screen.getByTestId('header');
//     expect(header === undefined).not.equal(true);

//     const homeButton = screen.getByTestId('menuBtn1');
//     expect(homeButton === null).not.equal(true); // Home button is rendered
//   });

//   it('should show Search component when Search button is clicked', () => {
//     render(<Header />);

//     const searchButton = screen.getByTestId('searchBtn');
//     expect(searchButton === null).not.equal(true); // Ensure button exists

//     fireEvent.click(searchButton);

//     const searchComponent = screen.queryByText('Search Component');
//     expect(searchComponent === null).not.equal(true); // Search component appears
//   });

//   it('should hide Search component when Notification button is clicked', () => {
//     render(<Header />);

//     // Show the search component first
//     const searchButton = screen.getByTestId('searchBtn');
//     fireEvent.click(searchButton);

//     const searchComponentVisible = screen.queryByText('Search Component');
//     expect(searchComponentVisible === null).not.equal(true);

//     // Now click the Notification button
//     const notificationButton = screen.getByTestId('menuBtn3');
//     fireEvent.click(notificationButton);

//     const searchComponentHidden = screen.queryByText('Search Component');
//     expect(searchComponentHidden === null).equal(true); // Search component is hidden
//   });

//   it('should toggle sidebar visibility when hideSideBar is triggered', () => {
//     render(<Header />);

//     const header = screen.getByTestId('header');
//     const homeButton = screen.getByTestId('menuBtn1');
//     fireEvent.click(homeButton);

//     // Check that the sidebar width is toggled (CSS-based check, assume rendered classNames)
//     expect(header.className.includes('w-20')).not.equal(true);
//     fireEvent.click(homeButton);
//     expect(header.className.includes('w-[260px]')).not.equal(true);
//   });
// });
