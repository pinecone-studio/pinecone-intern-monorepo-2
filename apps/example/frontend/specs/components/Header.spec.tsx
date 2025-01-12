import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { Header } from '../../src/components';
import { useAuth } from 'src/components/providers';

jest.mock('src/components/providers');

describe('Header', () => {
  it('should render successfully', async () => {
    (useAuth as jest.Mock).mockReturnValue({ user: null, signout: jest.fn() });

    render(<Header />);
  });

  it('should render successfully logged in', async () => {
    (useAuth as jest.Mock).mockReturnValue({ user: {}, signout: jest.fn() });

    render(<Header />);
  });
});
