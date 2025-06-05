
import HomeHeader from "@/components/home-header/Header";
import FooterReserve from "@/components/footer/footer-reserve";
import CheckInSection from "./_components/CheckInSection";
import FilteredHotels from "./_components/FilteredHotels";
const SearchPage = () => {
    return (
        <div>
            <HomeHeader></HomeHeader>
            <main className="min-h-screen w-full flex justify-center">
                <div className="w-[1280px]  min-h-screen px-[60px] py-[32px] gap-12 flex">
                    <CheckInSection></CheckInSection>
                    <FilteredHotels></FilteredHotels>
                </div>
            </main>
            <FooterReserve></FooterReserve>
        </div>
    )
}
export default SearchPage;