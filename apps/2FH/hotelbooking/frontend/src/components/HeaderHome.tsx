import Image from 'next/image';

export const HeaderHome = () => {
  return (
    <div className="flex justify-center justify-between py-4 lg:px-80 px-4 mb-[-64px]">
      <Image src="https://res.cloudinary.com/dpbmpprw5/image/upload/v1755855469/Frame_1321316490_1_kl7kiv.png" width={86} height={20} alt="logo" className="object-contain" />
      <div className="flex gap-4 items-end text-white">
        <p>My booking</p>
        <p>Shagai</p>
      </div>
    </div>
  );
};
