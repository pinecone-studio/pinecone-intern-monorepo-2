import Image from 'next/image';

export const Header = () => {
  return (
    <div className="flex justify-center justify-between py-4">
      <Image src="https://res.cloudinary.com/dpbmpprw5/image/upload/v1755846876/Frame_1321316490_bnbdbx.png" width={86} height={20} alt="logo" className="object-contain" />
      <div className="flex gap-4 items-end">
        <p>My booking</p>
        <p>Shagai</p>
      </div>
    </div>
  );
};
