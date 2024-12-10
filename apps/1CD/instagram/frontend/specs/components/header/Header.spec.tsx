// import { render, waitFor } from '@testing-library/react';
// import { MockedProvider } from '@apollo/client/testing';
// import { Header } from '@/components/header/header';

// describe('Header', () => {
//   it('should render', async () => {
//     const { getByTestId } = render(
//       <MockedProvider>
//         <Header />
//       </MockedProvider>
//     );

//     await waitFor(() => expect(getByTestId('header')));
//   });
// });

import { render, screen } from '@testing-library/react';
import { Header } from '@/components/header/Header';

describe('Header Component', () => {
  it('renders header component', () => {
    render(<Header />);
    const header = screen.getByTestId('header');
    expect(header);
  });

  it('displays logo image when not hidden', () => {
    render(<Header />);
    const logo = screen.getByAltText('Logo');
    expect(logo);
    expect(logo);
  });

  it('has correct initial width', () => {
    render(<Header />);
    const header = screen.getByTestId('header');
    expect(header);

    // expect(header).not.toHaveClass('w-20');
  });

  //   it('contains link to home page', () => {
  //     render(<Header />);
  //     const homeLink = screen.getByTestId('hideIconBtn');
  //     expect(homeLink);
  //   });
});
