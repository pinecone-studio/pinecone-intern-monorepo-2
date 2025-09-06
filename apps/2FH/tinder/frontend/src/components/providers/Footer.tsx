import Image from 'next/image';

export const Footer = () => {
  return (
    <footer className="absolute bottom-0 left-0 right-0 z-10 flex items-center justify-between p-6 px-8 md:px-[200px]">
      <div className="flex items-center space-x-2">
        <div className="w-[101px] h-[24px] opacity-50">
          <Image src="https://res.cloudinary.com/dlk2by5fg/image/upload/v1757329909/TinderLogo-2017_2_2_lhx2v6.png" alt="Tinder Logo" width={101} height={24} className="w-full h-full object-cover" />
        </div>
      </div>

      <div className="text-white text-sm opacity-50">
        © Copyright 2024
      </div>
    </footer>
  );
};
