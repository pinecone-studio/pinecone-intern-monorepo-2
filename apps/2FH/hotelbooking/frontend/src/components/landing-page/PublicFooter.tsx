import { Mail, Phone, Headphones } from 'lucide-react';

export const PublicFooter = () => {
  return (
    <div data-testid="Footer-Container" className="mt-auto bg-white">
      <div className="flex justify-between w-[1280px] mx-auto pt-10 pb-10 px-8">
        <div className="flex flex-col gap-4">
          <div className="flex gap-[5px] items-center">
            <div className="p-3 bg-black rounded-full opacity-80"></div>
            <div className="text-black font-semibold">Pedia</div>
          </div>
          <div className="text-black text-sm">© 2025 Booking Mongolia. All Rights Reserved.</div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="text-black font-semibold">Contact Information</div>
          <div className="flex items-center gap-2 text-black text-sm">
            <span>
              <Mail size={16} />
            </span>
            <span>Email: support@pedia.mn</span>
          </div>
          <div className="flex items-center gap-2 text-black text-sm">
            <span>
              <Phone size={16} />
            </span>
            <span>Phone: +976 (11) 123-4567</span>
          </div>
          <div className="flex items-center gap-2 text-black text-sm">
            <span>
              <Headphones size={16} />
            </span>
            <span>Customer Support: Available 24/7</span>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="text-black font-semibold">Follow us</div>
          <div className="text-black text-sm">Facebook</div>
          <div className="text-black text-sm">Instagram</div>
          <div className="text-black text-sm">Twitter</div>
          <div className="text-black text-sm">Youtube</div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="text-black font-semibold">Policies</div>
          <div className="text-black text-sm">Terms & Conditions</div>
          <div className="text-black text-sm">Privacy</div>
          <div className="text-black text-sm">Cookies</div>
          <div className="text-black text-sm">Cancellation Policy</div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="text-black font-semibold">Other</div>
          <div className="text-black text-sm">About us</div>
          <div className="text-black text-sm">Careers</div>
          <div className="text-black text-sm">Travel guides</div>
        </div>
      </div>
    </div>
  );
};
