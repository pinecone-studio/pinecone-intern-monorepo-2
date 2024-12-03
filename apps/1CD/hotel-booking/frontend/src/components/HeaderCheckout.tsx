const HeaderCheckout = () => {
    return (
        <div className="flex flex-col gap-4 max-w-full">
            <div className="bg-background py-4">
                <div className="max-w-[1280px] w-full mx-auto flex justify-between p-4">
                    
                    <div className="flex gap-2">
                        <div className="w-5 h-5 bg-[#013B94] rounded-full"></div>
                        <p className="text-[#09090B]">Pedia</p>
                    </div>
                    <div className="flex gap-4">
                        <p className="text-sm font-medium text-[#09090B">Register</p>
                        <p className="text-sm font-medium text-[#09090B">Sign in</p>
                    </div>
                </div>
            </div>
            <div className="bg-background py-4">
                <div className="max-w-[1280px] w-full mx-auto flex justify-between p-4">
                    <div className="flex gap-2">
                        <div className="w-5 h-5 bg-[#013B94] rounded-full"></div>
                        <p className="text-[#09090B]">Pedia</p>
                    </div>
                    <div className="flex gap-4">
                        <p className="text-sm font-medium text-[#09090B">My Booking</p>
                        <p className="text-sm font-medium text-[#09090B">Shagai</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default HeaderCheckout;