import Image from "next/image";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md space-y-2">

        <div className="text-center">
          <Image
            src="/logo.png"
            alt="Tinder Logo"
            width={160}
            height={160}
            className="mx-auto h-50"
          />
        </div>
        <div className="bg-white  rounded-2xl p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
