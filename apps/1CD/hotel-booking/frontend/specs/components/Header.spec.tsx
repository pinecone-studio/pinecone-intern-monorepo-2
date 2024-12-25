import Login from '@/app/(client)/(auth)/_components/Login';
import SignupVerifyEmail from '@/app/(client)/(auth)/_components/SignupVerifyEmail';
import Header from '@/components/Header';
import { render } from '@testing-library/react';

describe('Header', () => {
  it('should render successfully', () => {
    render(<Header />);
  });
  it('should render signup page when clicked on register button', () => {
    render(<SignupVerifyEmail />);
  });
  it('should render signup page when clicked on register button', () => {
    render(<Login />);
  });
});
