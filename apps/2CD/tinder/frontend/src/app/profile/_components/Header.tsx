'use client';
import Image from "next/image";
import { MessageSquare } from "lucide-react";
import React from "react";
import Avatar from "@mui/material/Avatar";

const Header = () => {
    return (
        <div className="w-screen flex items-center justify-between border-b border-[#444]">
            <div className="w-full flex justify-between items-center my-3 mx-80">
                <Image src="/TinderLogo.png" alt="Logo" width={100} height={24} priority/>
                <div className="flex flex-row gap-4 items-center">
                    <MessageSquare className="text-white w-4 h-4" />
                    <Avatar/>
                </div>
            </div>
        </div>
    );
};

export default Header;