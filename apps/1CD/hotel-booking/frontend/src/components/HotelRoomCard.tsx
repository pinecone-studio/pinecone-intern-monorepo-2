import { Button } from "@/components/ui/button";
import { ArrowBigRight, Car, CaravanIcon, ChevronRight, DoorClosed, DumbbellIcon, FlowerIcon, ParkingCircleIcon, Utensils, WifiIcon } from "lucide-react"

const HotelRoomCard = () => {
    return (
        <div className="border border-solid 1px rounded-md w-[416px]">
            <div className="bg-[#EBEBEB] h-[216px]"></div>
            <div className="p-4">
                <div className="flex flex-col gap-4">
                    <p className="text-base font-bold">Economy Double Room, City View</p>
                    <div className="flex flex-col gap-3 py-4">
                        <div className="flex gap-2">
                            <WifiIcon className="w-4 h-4" />
                            <p className="text-sm font-normal">Free WiFi</p>
                        </div>
                        <div className="flex gap-2">
                            <FlowerIcon className="w-4 h-4" />
                            <p className="text-sm font-normal">Spa access</p>
                        </div>
                        <div className="flex gap-2">
                            <ParkingCircleIcon className="w-4 h-4" />
                            <p className="text-sm font-normal">Free self parking</p>
                        </div>
                        <div className="flex gap-2">
                            <Utensils className="w-4 h-4" />
                            <p className="text-sm font-normal">Complimentary breakfast</p>
                        </div>
                        <div className="flex gap-2">
                            <DumbbellIcon className="w-4 h-4" />
                            <p className="text-sm font-normal">Fitness center access</p>
                        </div>
                        <div className="flex gap-2">
                            <Car className="w-4 h-4" />
                            <p className="text-sm font-normal">Airport shuttle service</p>
                        </div>
                        <div className="flex gap-2">
                            <DoorClosed className="w-4 h-4" />
                            <p className="text-sm font-normal">Room cleaning service</p>
                        </div>
                        <div className="flex gap-2 items-center py-2">
                            <p className="text-sm font-medium text-[#2563EB]">Show more</p>
                            <ChevronRight className="w-4 h-4 text-[#2563EB]" />
                        </div>
                    </div>
                </div>
                <div className="py-4">
                    <div className="w-[384px] border border-solid 1px bg-[#E4E4E7]"></div>
                </div>
                <div className="flex justify-between w-[384px]">
                    <div className="flex flex-col gap-1">
                        <p className="text-xs font-normal text-[#71717A]">Total</p>
                        <p className="text-xl font-medium text-[#09090B]">150,000₮</p>
                        <div className="flex gap-1">
                            <p className="text-xs font-normal text-[#000000]">80,000₮</p>
                            <p className="text-xs font-normal text-[#000000]">Price per night</p>
                        </div>
                        <div className="flex gap-2 items-center py-2">
                            <p className="text-sm font-medium text-[#2563EB]">Price detail</p>
                            <ChevronRight className="w-4 h-4 text-[#2563EB]" />
                        </div>
                    </div>
                    <div className="pt-14">
                        <Button className="bg-[#2563EB] rounded-md py-2 px-3">Reserve</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default HotelRoomCard;