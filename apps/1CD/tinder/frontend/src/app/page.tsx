'use client';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

const HomePage = () => {
  return (
    <div className="relative min-h-screen" data-cy="homepage">
      <div className="absolute inset-0" data-cy="background-container">
        <Image src="/img/home.png" alt="Home Background" layout="fill" quality={100} priority />
        <div className="absolute inset-0 bg-black/70" data-cy="background-overlay" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen" data-cy="content-container">
        <div className="p-4" data-cy="navbar">
          <div className="flex items-center justify-between mx-auto max-w-7xl" data-cy="navbar-content">
            <div className="flex items-center gap-2" data-cy="logo-container">
              <Image src={`/img/Vector.png`} alt="Tinder logo" width={40} height={40} className="w-[24px] h-[28px]" />
              <span className="text-2xl font-semibold text-white" data-cy="logo-text">
                tinder
              </span>
            </div>
            <div className="flex items-center gap-4" data-cy="navbar-links">
              <Button variant="ghost" className="text-white rounded-full hover:text-white hover:bg-white/20 ">
                <Link href="/register/email" data-cy="create-account-link">
                  Create Account
                </Link>
              </Button>
              <Button className="text-black bg-white rounded-full hover:bg-white/90">
                <Link href="/signIn" data-cy="login-link">
                  Log in
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center flex-1" data-cy="main-content">
          <div className="px-4 space-y-8 text-center" data-cy="cta-container">
            <h1 className="sm:text-6xl sm:font-bold sm:text-white text-white text-3xl font-semibold" data-cy="main-heading">
              Swipe Right®
            </h1>
            <Button
              size="lg"
              className="sm:px-8 sm:text-lg sm:text-white sm:rounded-full sm:bg-gradient-to-r sm:from-pink-500 sm:to-rose-500 sm:hover:from-pink-600 sm:hover:to-rose-600 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 font-medium text-lg"
            >
              <Link href="/register/email" data-cy="main-cta-button">
                Create Account
              </Link>
            </Button>
          </div>
        </div>

        <div className="relative" data-cy="footer">
          <div className="absolute inset-x-0 top-0 h-[1px] bg-white/20" />
          <div className="flex items-center justify-between p-4 mx-auto max-w-7xl" data-cy="footer-content">
            <div className="flex items-center gap-2" data-cy="footer-logo">
              <Image src={`/img/Vector.png`} alt="Tinder logo" width={40} height={40} className="w-[24px] h-[28px]" color="#FFFFFF" />
              <span className="text-2xl font-semibold text-white">tinder</span>
            </div>
            <div className="text-sm text-white/60" data-cy="footer-text">
              © Copyright 2024
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
