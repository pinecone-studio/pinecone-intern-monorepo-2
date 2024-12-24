import Login from '@/app/(client)/(auth)/_components/Login';
import VerifyEmail from '@/app/(client)/(auth)/_components/VerifyEmail';
import Header from '@/components/Header';
import { render } from '@testing-library/react';
// import { useRouter } from 'next/navigation';

// beforeEach(() => {
//   useRouter: jest.fn();
// });
describe('Header', () => {
  it('should render successfully', () => {
    render(<Header />);
  });
  it('should render signup page when clicked on register button', () => {
    render(<VerifyEmail />);
  });
  it('should render signup page when clicked on register button', () => {
    render(<Login />);
  });
});
