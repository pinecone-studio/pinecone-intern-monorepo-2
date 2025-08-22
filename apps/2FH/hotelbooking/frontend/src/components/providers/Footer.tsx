import { CreditCard, Facebook, Instagram, Mail, Phone, Twitter, Youtube } from 'lucide-react';
import Image from 'next/image';

export const Footer = () => {
  return (
    <footer className="py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center mb-4">
              <Image src="https://res.cloudinary.com/dpbmpprw5/image/upload/v1755857805/Logo_d1b7lz.png" alt="logo" width={86} height={20} />
            </div>
            <p className=" text-sm">© 2024 Booking Mongolia. All Rights Reserved.</p>
            <div className="flex space-x-2 mt-4">
              <CreditCard className="w-8 h-6 text-blue-500" />
              <div className="w-8 h-6 bg-red-600 rounded"></div>
              <div className="w-8 h-6 bg-blue-600 rounded"></div>
              <div className="w-8 h-6 bg-green-600 rounded"></div>
            </div>
            <p className="text-xs mt-2">Accepted Payment Methods</p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contact Information</h3>
            <div className="space-y-3 text-sm ">
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                <span>support@pedia.mn</span>
              </div>
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                <span>+976 (11) 123-4567</span>
              </div>
              <div>
                <p className="font-medium">Customer Support:</p>
                <p>Available 24/7</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Follow us</h3>
            <div className="space-y-2 text-sm ">
              <div className="flex items-center">
                <Facebook className="w-4 h-4 mr-2" />
                <span>Facebook</span>
              </div>
              <div className="flex items-center">
                <Instagram className="w-4 h-4 mr-2" />
                <span>Instagram</span>
              </div>
              <div className="flex items-center">
                <Twitter className="w-4 h-4 mr-2" />
                <span>Twitter</span>
              </div>
              <div className="flex items-center">
                <Youtube className="w-4 h-4 mr-2" />
                <span>Youtube</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Policies</h3>
            <div className="space-y-2 text-sm ">
              <p className="hover:text-white cursor-pointer">Terms & Conditions</p>
              <p className="hover:text-white cursor-pointer">Privacy</p>
              <p className="hover:text-white cursor-pointer">Cookies</p>
              <p className="hover:text-white cursor-pointer">Cancellation Policy</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Other</h3>
            <div className="space-y-2 text-sm ">
              <p className="hover:text-white cursor-pointer">About us</p>
              <p className="hover:text-white cursor-pointer">Careers</p>
              <p className="hover:text-white cursor-pointer">Travel guides</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
