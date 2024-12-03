import { Copyright } from 'lucide-react';
import { Mail } from 'lucide-react';
import { Phone } from 'lucide-react';
import { Headphones } from 'lucide-react';

const FooterHome = () => {
  return (
    <div className="container mx-auto max-w-[1920px] h-[280px] bg-yellow-200 flex flex-row justify-around">
      <div className="pt-10 flex flex-col justify-between">
        <div>
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
            <img src="./images/cards-cc_jcb.png"></img>
            <img src="./images/cards-cc_visa.png"></img>
            <img src="./images/cards-cc_master_card.png"></img>
            <img src="./images/cards-cc_american_express.png"></img>
          </div>
          <p className="pt-2">Accepted Payment Methods</p>
        </div>
      </div>

      <div className="pt-10 my-3 w-[168px] text-[14px]">
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
      <div className="flex flex-col pt-10 my-3 text-[14px] gap-3">
        <p>Follow us</p>
        <a href="https://www.facebook.com/">Facebook</a>
        <a href="https://www.instagram.com/">Instagram</a>
        <a href="https://x.com/">Twitter</a>
        <a href="https://www.youtube.com/">Youtube</a>
      </div>
      <div className="flex flex-col pt-10 my-3 text-[14px] gap-3">
        <p>Policies</p>
        <a href="/TermsCondition">Terms & Conditions</a>
        <a href="/Privacy">Privacy</a>
        <a href="/Cookies">Cookies</a>
        <a href="/CancelationPolicy">Cancelation Policy</a>
      </div>
      <div className="flex flex-col pt-10 my-3 text-[14px] gap-3">
        <p>Other</p>
        <a href="/AboutUs">About us</a>
        <a href="/Careers">Careers</a>
        <a href="/TravelGuides">Travel guides</a>
      </div>
    </div>
  );
};
export default FooterHome;
