import { Copyright } from 'lucide-react';
import { Mail } from 'lucide-react';
import { Phone } from 'lucide-react';
import { Headphones } from 'lucide-react';
import Image from 'next/image';

const FooterHome = () => {
  return (
    <div className="container mx-auto max-w-[1600px] h-auto px-4 flex flex-col md:flex-row justify-around mb-10">
      <div className="flex flex-col pt-10 md:justify-between">
        <div className="mb-4 md:mb-0">
          <div className="flex gap-1">
            <div className="w-5 h-5 bg-black rounded-full"></div>
            <p className="text-[16.8px] pb-2">Pedia</p>
          </div>
          <div className="flex items-center gap-1">
            <Copyright />
            <p className="text-[14px]">2024 Booking Mongolia. All Rights Reserved.</p>
          </div>
        </div>
        <div className="pb-10 text-[14px]">
          <div className="flex gap-1">
            <Image alt="logo" src="/images/cards-cc_jcb.png" width={500} height={500} className="w-4 h-4" />
            <Image alt="logo" src="/images/cards-cc_visa.png" width={500} height={500} className="w-4 h-4" />
            <Image alt="logo" src="/images/cards-cc_master_card.png" width={500} height={500} className="w-4 h-4" />
            <Image alt="logo" src="/images/cards-cc_american_express.png" width={500} height={500} className="w-4 h-4" />
          </div>
          <p className="pt-2">Accepted Payment Methods</p>
        </div>
      </div>

      <div className="pt-10 my-3 w-full md:w-[168px] text-[14px]">
        <p>Contact Information</p>
        <div className="flex items-center gap-2 pt-3">
          <Mail />
          <p>Email: support@pedia.mn</p>
        </div>

        <div className="flex items-center gap-2 pt-3">
          <Phone />
          <p>Phone: +976(11)123-4567</p>
        </div>

        <div className="flex items-center gap-2 pt-3">
          <Headphones />
          <p>Customer Support: Avaiable 24/7</p>
        </div>
      </div>
      <div className="flex flex-col pt-10 my-3 text-[14px] gap-3 w-full md:w-auto">
        <p>Follow us</p>
        <a href="https://www.facebook.com/">Facebook</a>
        <a href="https://www.instagram.com/">Instagram</a>
        <a href="https://x.com/">Twitter</a>
        <a href="https://www.youtube.com/">Youtube</a>
      </div>
      <div className="flex flex-col pt-10 my-3 text-[14px] gap-3 w-full md:w-auto">
        <p>Policies</p>
        <a href="/TermsCondition">Terms & Conditions</a>
        <a href="/Privacy">Privacy</a>
        <a href="/Cookies">Cookies</a>
        <a href="/CancelationPolicy">Cancelation Policy</a>
      </div>
      <div className="flex flex-col pt-10 my-3 text-[14px] gap-3 w-full md:w-auto">
        <p>Other</p>
        <a href="/AboutUs">About us</a>
        <a href="/Careers">Careers</a>
        <a href="/TravelGuides">Travel guides</a>
      </div>
    </div>
  );
};
export default FooterHome;
