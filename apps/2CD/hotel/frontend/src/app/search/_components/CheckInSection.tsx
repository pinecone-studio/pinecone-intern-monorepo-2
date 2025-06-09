import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
const CheckInSection = () => {
    return (
        <div className="w-[240px] flex flex-col gap-2">
            <div className="flex flex-col gap-2">
                <p className="text-[15px]">Search by property name</p>
                <Input type="search" placeholder="Search" />
            </div>
            <div className="w-full h-[1px] bg-[#E4E4E7] my-4"></div>
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-3">
                    <p>Rating</p>
                    <div className="flex items-center gap-3">
                        <Checkbox id="terms" />
                        <Label htmlFor="terms">+9</Label>
                    </div>
                    <div className="flex items-center gap-3">
                        <Checkbox id="terms" />
                        <Label htmlFor="terms">+8</Label>
                    </div>
                    <div className="flex items-center gap-3">
                        <Checkbox id="terms" />
                        <Label htmlFor="terms">+7</Label>
                    </div>
                </div>
                <div className="flex flex-col gap-3">
                    <p>Stars</p>
                    <div className="flex items-center gap-3">
                        <Checkbox id="terms" />
                        <Label htmlFor="terms">5 stars</Label>
                    </div>
                    <div className="flex items-center gap-3">
                        <Checkbox id="terms" />
                        <Label htmlFor="terms">4 stars</Label>
                    </div>
                    <div className="flex items-center gap-3">
                        <Checkbox id="terms" />
                        <Label htmlFor="terms">3 stars</Label>
                    </div>
                    <div className="flex items-center gap-3">
                        <Checkbox id="terms" />
                        <Label htmlFor="terms">2 stars</Label>
                    </div>
                    <div className="flex items-center gap-3">
                        <Checkbox id="terms" />
                        <Label htmlFor="terms">1 stars</Label>
                    </div>
                </div>
                <div className="flex flex-col gap-3">
                    <p>Amenities</p>
                    <div className="flex items-center gap-3">
                        <Checkbox id="terms" />
                        <Label htmlFor="terms">Pet friendly</Label>
                    </div>
                    <div className="flex items-center gap-3">
                        <Checkbox id="terms" />
                        <Label htmlFor="terms">Airport shuttle included</Label>
                    </div>
                    <div className="flex items-center gap-3">
                        <Checkbox id="terms" />
                        <Label htmlFor="terms">Pool</Label>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default CheckInSection;