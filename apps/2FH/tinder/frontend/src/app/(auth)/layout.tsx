import Image from "next/image";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md space-y-2">

        <div className="bg-white  rounded-2xl p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
