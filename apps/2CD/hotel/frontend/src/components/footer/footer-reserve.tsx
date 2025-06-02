/* eslint-disable unicorn/filename-case */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable complexity */
import React from 'react';
import { Mail } from 'lucide-react';
import { Phone } from 'lucide-react';
import { Headphones } from 'lucide-react';
const FooterReserve = () => {
    return (
        <div className="w-full flex justify-center items-start bg-white-500">
            <div className="w-[1280px] bg-black-500 h-[200px] flex justify-between">
                <div className="flex flex-col justify-between items-start ">
                    <div className="flex flex-col gap-[12px]">
                        <div className="flex gap-2 items-center">
                            <div className="bg-black h-[20px] w-[20px] rounded-full"></div>
                            <p className="text-[18px]">Pedia</p>
                        </div>
                        <p>© 2025 Booking Mongolia. All Rights Reserved.</p>
                    </div>
                    <div className="flex flex-col gap-[12px]">
                        <div className="flex gap-[8px]">
                            <div className="bg-black h-[24px] w-[38px]"></div>
                            <div className="bg-yellow-500 h-[24px] w-[38px]"></div>
                            <div className="bg-green-500 h-[24px] w-[38px]"></div>
                            <div className="bg-red-500 h-[24px] w-[38px]"></div>
                        </div>
                        <p>Accepted Payment Methods</p>
                    </div>
                </div>
                <div className='flex flex-col justify-between w-40'>
                    <p className='text-[14px] font-medium '>Contact Information</p>
                    <div className='flex items-center gap-3'>
                        <Mail className='h-[16px] w-[16px]'/>
                        <div className='flex flex-col gap-1'>
                            <p className='text-[14px] font-medium'>Email:</p>
                            <p className='text-[14px] font-normal'>support@pedia.mn</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-3'>
                        <Phone className='h-[16px] w-[16px]'/>
                        <div>
                            <p className='text-[14px] font-medium'>Phone:</p>
                            <p className='text-[14px] font-normal'>+976 (11) 123-4567</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-3'>
                        <Headphones className='h-[16px] w-[16px]'/>
                        <div>
                            <p className='text-[14px] font-medium'>Customer Support:</p>
                            <p className='text-[14px] font-normal'>Available 24/7</p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <p className="text-[14px]">Follow us </p>
                    <p className="text-[14px]">Facebook</p>
                    <p className="text-[14px]">Instagram</p>
                    <p className="text-[14px]">Twitter</p>
                    <p className="text-[14px]">Youtube</p>
                </div>
                <div className="flex flex-col gap-2 w-40">
                    <p className="text-[14px]">Policies</p>
                    <p className="text-[14px]">Terms & Conditions</p>
                    <p className="text-[14px]">Privacy</p>
                    <p className="text-[14px]">Cookies</p>
                    <p className="text-[14px]">Cancellation Policy</p>
                </div>
                <div className="flex flex-col gap-2 w-28">
                    <p className="text-[14px]">Other</p>
                    <p className="text-[14px]">About us</p>
                    <p className="text-[14px]">Careers</p>
                    <p className="text-[14px]">Travel guides</p>
                </div>
            </div>
        </div>
    )
}
export default FooterReserve;