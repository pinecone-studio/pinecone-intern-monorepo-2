import { Clock, Tag } from "lucide-react"

export const DateFilter = () => {
    return (
        <div>
            <div className="flex gap-1 mt-5">
                <p className="text-sm">08/01</p>
                <p className="text-sm text-[#5f5f62]">Өнөөдөр</p>
            </div>
            <div className="w-[608px] border bg-[#E4E4E7] rounded-lg h-[100px] mt-[10px] flex flex-col justify-center p-6">
                <div className="flex gap-4">
                    <div className="w-[56px] h-[56px] rounded-full bg-black"></div>
                    <div className="flex flex-col gap-2">
                        <p>A.Selenge</p>
                        <div className="flex gap-4">
                            <div className="flex items-center text-sm gap-1.5"><Clock size={13} strokeWidth={2.75} color="#5f5f62" />13:00 - 18:00</div>
                            <div className="flex items-center text-sm gap-1.5"><Tag size={14} color='#71717A' />Чөлөө (5 цаг)</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}