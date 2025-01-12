import { Container } from './';
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { IoCallOutline, IoMailOutline } from 'react-icons/io5';
import Link from 'next/link';

export const Footer = () => {
  return (
    <div className="mt-20 bg-black">
      <Container>
        <div className="py-16 text-white">
          <div className="flex justify-between">
            <Link href="/">
              <svg width="42" height="36" viewBox="0 0 42 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M40.0561 13.9004L34.5292 3.65254C33.5106 1.75984 31.5182 0.577454 29.3494 0.577454H23.4795V3.48088H23.482C24.5644 3.48088 25.5606 4.07084 26.0697 5.01744L31.595 15.2667C32.0567 16.1211 32.2866 17.0598 32.2866 18C32.2866 18.9402 32.0567 19.8784 31.595 20.7332L26.0697 30.9825C25.5606 31.9291 24.5644 32.5191 23.482 32.5191H23.4795V35.4225H29.3494C31.5182 35.4225 33.5106 34.2401 34.5292 32.3474L40.0561 22.0996C40.7456 20.8171 41.0911 19.4093 41.0911 18C41.0911 16.5907 40.7456 15.1829 40.0561 13.9004ZM11.7408 0.577454H17.6116V3.48088H17.6091C16.5267 3.48088 15.5305 4.07084 15.0205 5.01744L9.49661 15.2667C9.03442 16.1211 8.80457 17.0598 8.80457 18C8.80457 18.9402 9.03442 19.8784 9.49661 20.7332L15.0205 30.9825C15.5305 31.9291 16.5267 32.5191 17.6091 32.5191H17.6116V35.4225H11.7408C9.57289 35.4225 7.58053 34.2401 6.56192 32.3474L1.03507 22.0996C0.345521 20.8171 0 19.4093 0 18C0 16.5907 0.345521 15.1829 1.03507 13.9004L6.56192 3.65254C7.58053 1.75984 9.57289 0.577454 11.7408 0.577454Z"
                  fill="white"
                />
              </svg>
            </Link>
            <div className="flex gap-8">
              <Link href="/">
                <div className="flex items-center gap-4 group">
                  <div className="flex items-center justify-center w-12 h-12 duration-300 border-2 rounded-full border-zinc-800 group-hover:bg-white">
                    <IoCallOutline className="w-5 h-5 group-hover:text-black" />
                  </div>
                  <p className=" group-hover:underline group-hover:underline-offset-4">(976) 7007-1234</p>
                </div>
              </Link>
              <Link href="/">
                <div className="flex items-center gap-4 group">
                  <div className="flex items-center justify-center w-12 h-12 border-2 rounded-full border-zinc-800 group-hover:border-white">
                    <IoMailOutline className="w-5 h-5" />
                  </div>
                  <p className=" group-hover:underline group-hover:underline-offset-4">contact@ecommerce.mn</p>
                </div>
              </Link>
            </div>
          </div>
          <div className="border border-zinc-800 my-11"></div>
          <div className="flex justify-between">
            <div>© 2024 Ecommerce MN</div>
            <div className="flex gap-6">
              <Link href="/">
                <FaFacebook className="w-5 h-5" />
              </Link>
              <Link href="/">
                <FaInstagram className="w-5 h-5" />
              </Link>
              <Link href="/">
                <FaTwitter className="w-5 h-5" />
              </Link>
              <Link href="/">
                <FaLinkedin className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};
