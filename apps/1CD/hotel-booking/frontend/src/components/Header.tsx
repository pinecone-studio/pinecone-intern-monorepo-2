
const Header = () => {
    return (
        <div className="flex flex-col gap-4 max-w-full">
            <div className="bg-[#013B94] py-4">
                <div className="max-w-[1280px] w-full mx-auto flex justify-between p-4">
                    <div className="flex gap-2">
                        <div className="w-5 h-5 bg-white rounded-full"></div>
                        <p className="text-[#09090B]">Pedia</p>
                    </div>
                    <div className="flex gap-4">
                        <p className="text-sm font-medium text-[#FAFAFA]">Register</p>
                        <p className="text-sm font-medium text-[#FAFAFA]">Sign in</p>
                    </div>
                </div>
            </div>
            <div className="bg-[#013B94] items-center py-4">
                <div className="max-w-[1280px] w-full mx-auto flex justify-between p-4">
                    <div className="flex gap-2">
                        <div className="w-5 h-5 bg-white rounded-full"></div>
                        <p className="text-[#09090B]">Pedia</p>
                    </div>
                    <div className="flex gap-4">
                        <p className="text-sm font-medium text-[#FAFAFA]">My Booking</p>
                        <p className="text-sm font-medium text-[#FAFAFA]">Shagai</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Header;