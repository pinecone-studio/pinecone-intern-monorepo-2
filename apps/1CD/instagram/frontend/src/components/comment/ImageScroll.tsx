import React from 'react';
import Image from 'next/image';

const ImageScroll = () => {
  return (
    <div>
      <Image fill={false} width={600} height={600} src="/images/img1.avif" alt="Photo1" className="w-[900px] h-[900px] bg-contain" />
    </div>
  );
};

export default ImageScroll;
