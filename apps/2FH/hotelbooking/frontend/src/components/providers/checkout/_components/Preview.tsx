import Image from 'next/image';

export const Preview = () => {
  return (
    <div>
      <Image
        src="https://res.cloudinary.com/dpbmpprw5/image/upload/v1755848588/Hotel_Image_z2qlwr.png"
        width={515}
        height={216}
        alt="logo"
        onError={(e) => {
          e.currentTarget.src = `default.png`;
        }}
        className="rounded-t-lg"
      />
      <div>
        <p>Hotel Name</p>
        <p>Hotel Address</p>
        <div className="flex">
          <p>8.6</p>
          <p>Excellent</p>
        </div>

        <p>Hotel Country</p>
      </div>
    </div>
  );
};
