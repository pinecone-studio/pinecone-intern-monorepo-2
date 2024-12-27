'use client';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

const Page = () => {
  return (
    <div className="min-h-screen relative" data-cy="homepage">
      <div className="absolute inset-0" data-cy="background-container">
        <Image src="/img/home.png" alt="Home Background" layout="fill" quality={100} priority className="w-full min-h-screen" />
        <div className="absolute inset-0 bg-black/70" data-cy="background-overlay" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col" data-cy="content-container">
        <div className="p-4" data-cy="navbar">
          <div className="max-w-7xl mx-auto flex items-center justify-between" data-cy="navbar-content">
            <div className="flex items-center gap-2" data-cy="logo-container">
              <Image src={`/img/Vector.png`} alt="Tinder logo" width={40} height={40} className="w-[24px] h-[28px]" />
              <span className="text-2xl font-semibold text-white" data-cy="logo-text">
                tinder
              </span>
            </div>
            <div className="flex items-center gap-4" data-cy="navbar-links">
              <Button variant="ghost" className="text-white hover:text-white hover:bg-white/20 rounded-full ">
                <Link href="/register/email" data-cy="create-account-link">
                  Create Account
                </Link>
              </Button>
              <Button className="bg-white text-black hover:bg-white/90 rounded-full">
                <Link href="/signIn" data-cy="login-link">
                  Log in
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center" data-cy="main-content">
          <div className="text-center space-y-8 px-4" data-cy="cta-container">
            <h1 className="text-6xl font-bold text-white" data-cy="main-heading">
              Swipe Right®
            </h1>
            <Button size="lg" className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white text-lg px-8 rounded-full">
              <Link href="/register/email" data-cy="main-cta-button">
                Create Account
              </Link>
            </Button>
          </div>
        </div>

        <div className="relative" data-cy="footer">
          <div className="absolute inset-x-0 top-0 h-[1px] bg-white/20" />
          <div className="max-w-7xl mx-auto p-4 flex items-center justify-between" data-cy="footer-content">
            <div className="flex items-center gap-2" data-cy="footer-logo">
              <Image src={`/img/Vector.png`} alt="Tinder logo" width={40} height={40} className="w-[24px] h-[28px]" color="#FFFFFF" />
              <span className="text-2xl font-semibold text-white">tinder</span>
            </div>
            <div className="text-white/60 text-sm" data-cy="footer-text">
              © Copyright 2024
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
