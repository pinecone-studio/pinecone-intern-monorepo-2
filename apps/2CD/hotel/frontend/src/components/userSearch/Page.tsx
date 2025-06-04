"use client";
import React from 'react';
import { Button } from "@/components/ui/button";
import { CalendarSearch } from "./components/CalendarSearch";
import { TravelSearch } from './components/TravelSearch';
const UserSearchPage = () => {
    return (
        <div className="w-full h-full bg-white border-[#FFB700] border-[3px] rounded-[8px] flex">
            <div className='p-3 flex justify-between w-full h-full'>
                <div className='flex flex-col justify-between'>
                    <h1 className='text-[14px]'>Dates</h1>
                    <CalendarSearch />
                </div>
                <div className='flex flex-col justify-between'>
                    <h1 className='text-[14px]'>Travels</h1>
                    <TravelSearch />
                </div>
                <div className='flex items-end'>
                    <Button className='w-[95px] bg-[#2563EB] text-[white] hover:bg-[black]'>Search</Button>
                </div>
            </div>
        </div>
    )
}
export default UserSearchPage;