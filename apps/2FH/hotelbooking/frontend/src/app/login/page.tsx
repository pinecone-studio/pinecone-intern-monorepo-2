import { LoginComponent } from '@/components/login/_components/StepOne';

const LogIn = () => {
  return (
    <div data-cy="Login-container" className="w-screen h-screen flex justify-center items-center">
      <LoginComponent />
    </div>
  );
};
export default LogIn;
