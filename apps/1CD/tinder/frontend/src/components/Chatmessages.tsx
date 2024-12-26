'use client'

import { MessageSquareDashed } from "lucide-react"
import { useEffect, useRef } from "react"

type Props = {
    errormessage:any
    response:any
    user1:string
}
export const Chatmessages =({errormessage, response,user1}:Props)=>{
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  console.log(user1)
  const user2 = '675675e84bd85fce3de34006'

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []); 
    return (
        <div className="flex-1" data-cy="Chat-Part-Page">
        {errormessage ? (
          <div className="text-center flex flex-col justify-center items-center  h-full">
            {errormessage === 'Error occured: Could not find chat' ? (
              <div className="text-center flex flex-col justify-center items-center">
                <MessageSquareDashed size={18}/>
                <p className="text-sm text-foreground">Say Hi!</p>
                <p className="text-sm text-muted-foreground">You’ve got a match! Send a message to start chatting.</p>
              </div>
            ) : (
              <p className="text-sm text-red-500">Error loading chat data!</p>
            )}
          </div>
        ) : !response || response.length === 0 ? (
          <div className="flex flex-col justify-center items-center flex-1">
            <MessageSquareDashed size={18}/>
            <p className="text-sm text-foreground">Say Hi!</p>
            <p className="text-sm text-muted-foreground">You’ve got a match! Send a message to start chatting.</p>
          </div>
        ) : (
          <div className="overflow-y-auto p-4 flex flex-col max-h-[600px]">
            {response.map((resp: { content: string; senderId: string }, index: number) => {
              return (
                <div key={index} className={`${user2 == resp.senderId ? 'bg-[#E11D48] self-end max-w-[320px] text-white' : 'bg-[#F4F4F5] max-w-[220px] text-foreground'} p-4 rounded-lg mb-4`}>
                  {resp.content}
                </div>
              );
            })}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    )
}