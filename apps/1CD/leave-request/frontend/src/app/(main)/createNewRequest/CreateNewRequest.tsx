"use client"
import { Button } from "@/components/ui/button"
import { Send } from "lucide-react"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export const CreateNewRequest = () => {

    
    return (
        <div className="w-[600px] mx-auto p-8">
            <div className="border rounded-lg">
                <div className="p-7 grid gap-8">
                    <div className="grid gap-1.5">
                        <div className="text-[#000000] text-xl">Чөлөөний хүсэлт</div>
                        <div className="text-[#71717A] text-sm">Ажлын цагаар оффис дээр байх боломжгүй болсон аль ч тохиолдолд тус формыг заавал бөглөнө. </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <div className="text-[#000000] text-sm">Ангилал*</div>
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Сонгоно уу" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="Чөлөө">Чөлөө</SelectItem>
                                    <SelectItem value="Цалинтай чөлөө">Цалинтай чөлөө</SelectItem>
                                    <SelectItem value="Зайнаас ажиллах">Зайнаас ажиллах</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <div className="flex items-center gap-1 justify-end">
                            <div className="text-xs text-[#71717A]">Боломжит хугацаа:</div>
                            <div className="text-sm font-sans text-[#000000] ">- хоног</div>
                        </div>
                        <div className="flex justify-end w-full">
                            <Button className="w-[150px] gap-1.5 text-[#FAFAFA]" ><Send size={14} />Хүсэлт илгээх</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}
