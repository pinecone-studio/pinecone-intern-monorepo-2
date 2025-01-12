import { Copyright } from 'lucide-react';
const Footer = () => {
  return (
    <div>
      <div className="container mx-auto text-black max-w-[1280px] h-[192px]">
        <div className="flex gap-1 pt-10">
          <div className="w-5 h-5 bg-black rounded-full"></div>
          <p className="text-[16px] text-[#09090B]">Pedia</p>
        </div>
        <p className="text-[14px] text-[#09090B]">Some hotels require you to cancel more than 24 hours before check-in. Details on site.</p>
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
