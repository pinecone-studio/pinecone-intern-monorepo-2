// eslint-disable-next-line unicorn/filename-case
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
