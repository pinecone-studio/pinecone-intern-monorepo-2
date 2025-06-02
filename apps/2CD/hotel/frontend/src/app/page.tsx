/* eslint-disable unicorn/filename-case */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable complexity */
'use client';
import Header from "@/components/header/Header";
import FooterRegular from "@/components/footer/footer-regular";
import FooterReserve from "@/components/footer/footer-reserve";
import FooterCheckIn from "@/components/footer/footer-check-in";

const Page = () => {

  return (
    <div className="h-screen w-full ">
      <Header></Header>
      <main className="h-full">
      </main>
      <FooterReserve></FooterReserve>
      <FooterCheckIn></FooterCheckIn>
      <FooterRegular></FooterRegular>
    </div>
  );
};

export default Page;


