import { Copyright } from 'lucide-react';
const Footer = () => {
  return (
    <div className="container bg-gray-100 py-10 border-t border-gray-300 text-black max-w-[1280px] mx-auto px-4 grid gap-5 md:grid-cols-2 md:gap-4">
      <div>
        <div className="flex items-center gap-1">
          <div className="w-5 h-5 bg-[#013b94] rounded-full"></div>
          <p className="text-[16px] text-[#09090B] ">Pedia</p>
        </div>
        <p className="text-[14px] text-[#09090B] mt-4">Some hotels require you to cancel more than 24 hours before check-in. Details on site.</p>
      </div>
      <div>
        <div className="text-[14px] flex items-center gap-1 text-[#09090B]">
          <Copyright />
          <p>2024 Pedia is an Pedia Group company. All rights reserved.</p>
        </div>
        <p className="text-[14px] text-[#09090B]">Pedia and the Pedia logo are trademarks or registered trademarks of Pedia, LP in the United</p>
        <p className="text-[14px] text-[#09090B]">States and/or other countries. All other trademarks are the property of their respective owners.</p>
      </div>
    </div>
  );
};

export default Footer;
