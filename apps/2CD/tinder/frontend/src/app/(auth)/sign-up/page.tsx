import { SignUp } from "@clerk/nextjs";

const Signup = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Sign Up
        </h1>
        <div className="flex justify-center">
          <SignUp
            path="/sign-up"
            routing="path"
            signInUrl="/login"
            afterSignUpUrl="/"
          />
        </div>
      </div>
    </div>
  );
}
export default Signup