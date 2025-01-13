import Image from 'next/image';
export const NoPost = () => {
  return (
    <div data-cy="zeroPost" className="flex flex-col items-center space-y-8 mt-32">
      <div className="flex flex-col items-center space-y-5">
        <section className="relative flex items-center justify-center w-20 h-20 border-2 border-black rounded-full">
          <Image src="/images/camera.png" alt="camera" width="50" height="50" />
        </section>
        <h1 className="font-bold text-5xl">Share Photos</h1>
      </div>
      <p className="font-bold w-1/3 text-center">When you share photos, they will appear on your profile.</p>
      <p className="text-blue-500">Share your first photo</p>
    </div>
  );
};
