import { SignIn } from '@clerk/nextjs';

const signin = () => {
  return (
    <>
      <div className="flex justify-center">
        <SignIn />
      </div>
    </>
  );
};
export default signin;
