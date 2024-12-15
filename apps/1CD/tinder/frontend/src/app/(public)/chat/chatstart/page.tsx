"use client"

import { Chatpart } from "@/components/Chatpart"
import { Chatsidebar } from "@/components/Chatsidebar"
import {Matches}  from "@/components/Matches"

const Chat = ()=>{
    return (
        <div className="max-w-[1000px] m-auto">
            <Matches/>
            <div className="flex">
                <Chatsidebar/>
                <Chatpart/>
            </div>
        </div>
    )
}
export default Chat