import { SignUp } from '@clerk/nextjs';

const signup = () => {
  return (
    <>
      <div className='flex justify-center'>
        <SignUp />
      </div>
    </>
  );
};
export default signup;
