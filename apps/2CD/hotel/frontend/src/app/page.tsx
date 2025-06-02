'use client';
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import FooterCheckIn from "@/components/footer/FooterCheckIn";
import FooterReserve from "@/components/footer/FooterReserve";

const Page = () => {

  return (
    <div className="h-screen w-full ">
      <Header></Header>
      <main className="h-full">
      </main>
      <FooterReserve></FooterReserve>
      <FooterCheckIn></FooterCheckIn>
      <Footer></Footer>
    </div>
  );
};

export default Page;


