"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Button = ({ handleClick }: { handleClick: () => void }) => (
  <button onClick={handleClick} className="px-4 py-2 sm:px-5 sm:py-2 h-10 mt-4 lg:mt-3 font-bold text-white bg-gradient-to-r from-[#0029FF] to-black rounded-full flex gap-3 items-center hover:transition duration-200 hover:duration-200 ease-in-out ">
    <Image src="/icons/wallet.svg" alt="wallet" height={16} width={16} />
    Get Started
  </button>
);

export default function LandingPage() {
  const router = useRouter();

  const handleButtonClick = () => {
    router.push('/transfer');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative px-4 sm:px-6 lg:px-8">
      <div>
        <Image className="hidden sm:block absolute h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 top-[45%] left-1/2 transform -translate-x-1/2 -translate-y-1/2" src="/icons/dollarSign.png" alt="dollar_sign" width={80} height={80} />
        <Image className="hidden sm:block absolute top-[60%] left-[25%] h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 lg:h-32 lg:w-32" src="/icons/trust.png" alt="trust" width={160} height={160} />

        <div className="flex items-center ">
          <p className="font-light text-left text-[40px] sm:text-[60px] md:text-[80px] lg:text-[100px]">Welcome to</p>
          <Image src="/icons/coin.png" alt="coin" width={80} height={80} /> 
        </div>

        <div className="mt-4 sm:mt-0 sm:-mt-8 md:-mt-10 lg:-mt-14">
          <p className="font-bold text-left text-[40px] sm:text-[60px] md:text-[80px] lg:text-[100px]">Neobase Coding</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 items-center sm:items-center mt-4 sm:mt-0 sm:-mt-8 md:-mt-10 lg:-mt-14">
          <p className="font-bold text-left text-[40px] sm:text-[60px] md:text-[80px] lg:text-[100px]">Round</p>
          <Link href="/transfer">
            <Button handleClick={handleButtonClick} />
          </Link>
        </div>
        <Image className="hidden md:absolute md:top-4 md:left-4 md:h-12 md:w-12" src="/icons/dollarSign.png" alt="/icons/dollarSign.png" width={80} height={80} />
        <Image className="hidden md:absolute md:bottom-4 md:right-4 md:h-12 md:w-12" src="/icons/trust.png" alt="/icons/trust" width={80} height={80} />
      </div>
    </div>
  );
}
