"use client";
import Link from "next/link";
import React from "react";

export default function LandingHeader() {
  return (
    <header className="w-full h-[64px] bg-[#013b94]">
      <div className="max-w-6xl mx-auto flex justify-between items-center py-4 px-6">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-white rounded-full" />
          <span className="text-white text-xl font-semibold">Pedia</span>
        </Link>
        <nav className="space-x-6">
          <Link href="/register" className="text-white text-sm hover:underline">
            Register
          </Link>
          <Link href="/sign-in" className="text-white text-sm hover:underline">
            Sign in
          </Link>
        </nav>
      </div>
    </header>
  );
} 
