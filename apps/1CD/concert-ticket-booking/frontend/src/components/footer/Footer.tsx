import Link from 'next/link';
import Image from 'next/image';
import { Headphones, Mail, Phone } from 'lucide-react';

export const Footer = () => {
  return (
    <div className="px-4 bg-black border-t border-gray-600 md:px-8 lg:px-20">
      <div className="flex flex-col gap-8 py-8 text-white lg:flex-row lg:justify-between lg:py-16 lg:gap-0">
        <div className="flex flex-col gap-3">
          <Link href="/user/home" className="flex gap-2">
            <Image src="/images/logo.png" alt="logo" width={181} height={28} />
          </Link>
          <p className="text-sm text-gray-600">© 2024 Booking Mongolia. All Rights Reserved.</p>
        </div>
        <div className="flex flex-col gap-4">
          <div className="text-gray-600">Contact Information</div>
          <div className="flex flex-col gap-6 md:flex-row md:gap-12">
            <Link href="/">
              <div className="flex items-center gap-4 group">
                <div className="flex items-center justify-center w-12 h-12">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-gray-600">Email:</p>
                  <p className="text-sm group-hover:underline group-hover:underline-offset-4 lg:text-base">support@ticketinbooking.mn</p>
                </div>
              </div>
            </Link>
            <Link href="/">
              <div className="flex items-center gap-4 group">
                <div className="flex items-center justify-center w-12 h-12 ">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-gray-600">Phone:</p>
                  <p className=" group-hover:underline group-hover:underline-offset-4">+976 (11) 123-4567</p>
                </div>
              </div>
            </Link>
            <Link href="/">
              <div className="flex items-center gap-4 group">
                <div className="flex items-center justify-center w-12 h-12 ">
                  <Headphones className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-gray-600">Customer Support:</p>
                  <p className=" group-hover:underline group-hover:underline-offset-4">Available 24/7</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
