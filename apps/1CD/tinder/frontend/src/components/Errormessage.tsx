"use client"
type Props ={
  errormessage:any
  response:any
  user1:any
}
export const Errormessage = ({errormessage, response, user1}:Props)=>{
  console.log(errormessage)
    return (
        <div className="flex-1">
              {errormessage ? (
                <div className="text-center flex flex-col justify-center items-center text-red-500 h-full">
                  {errormessage == "Error occured: Could not find chat" ? (
                    <div className="text-center flex flex-col justify-center items-center">
                      <p className="text-sm text-foreground">Say Hi!</p>
                      <p className="text-sm text-muted-foreground">You’ve got a match! Send a message to start chatting.</p>
                    </div>
                  ) : (
                    <p className="text-sm">Error loading chat data!</p>
                  )}
                </div>
              ) : !response || response.length === 0 ? (
                <div className="flex flex-col justify-center items-center flex-1">
                  <p className="text-sm text-foreground">Say Hi!</p>
                  <p className="text-sm text-muted-foreground">You’ve got a match! Send a message to start chatting.</p>
                </div>
              ) : (
                <div className="overflow-y-auto p-4 flex flex-col max-h-[600px]">
                  {response.map((resp: { content: string; senderId: string }, index: number) => {
                    return (
                      <div key={index} className={`${user1 == resp.senderId ? 'bg-[#E11D48] self-end max-w-[320px] text-white' : 'bg-[#F4F4F5] max-w-[220px] text-foreground'} p-4 rounded-lg mb-4`}>
                        {resp.content}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
    )
}