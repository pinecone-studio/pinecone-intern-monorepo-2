"use client"
import { Button } from "@/components/ui/button"
import { Send } from "lucide-react"

import {  useCreateRequestQuery } from "@/generated"
import { useLogin } from "@/context/LoginContext"
import { SelectRequestType } from "./SelectRequestType"

export const CreateNewRequest = () => {

    const {email} = useLogin()
    console.log(email)
    
    
    const {loading, error, data} = useCreateRequestQuery({ variables: { email } })
    console.log(data)

    return (
        <div className="w-[600px] mx-auto p-8">
            <div className="border rounded-lg">
                <div className="p-7 grid gap-8">
                    <div className="grid gap-1.5">
                        <div className="text-[#000000] text-xl">Чөлөөний хүсэлт</div>
                        <div className="text-[#71717A] text-sm">Ажлын цагаар оффис дээр байх боломжгүй болсон аль ч тохиолдолд тус формыг заавал бөглөнө. </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <SelectRequestType/>
                        <div className="flex justify-end w-full">
                            <Button className="w-[150px] gap-1.5 text-[#FAFAFA]" ><Send size={14} />Хүсэлт илгээх</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}
