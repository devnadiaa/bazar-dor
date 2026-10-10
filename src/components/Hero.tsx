"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function Hero() {
  const [banglaDate, setBanglaDate] = useState("");

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat("bn-BD", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "Asia/Dhaka",
    });
    setBanglaDate(formatter.format(new Date()));
  }, []);

  return (
    <section className="w-full bg-[#FAFAFA] py-6 md:py-10">
      <div className="mx-auto max-w-[1120px] px-4 lg:px-0">
        <div className="flex flex-col-reverse items-center justify-between rounded-xl border border-[#EBEBEB] bg-white p-6 sm:p-8 md:flex-row md:items-center md:p-10 lg:h-[283px] lg:p-0 lg:pl-12 lg:pr-12 relative overflow-hidden">
          <div className="w-full text-left md:w-3/5 z-10">
            <div className="mb-4 inline-block rounded-full bg-[#EBF7F2] px-3 py-1 text-xs font-medium text-[#00875A] md:text-sm">
              {banglaDate || "\u00A0"}
            </div>
            <h1 className="mb-4 text-2xl font-bold tracking-tight text-[#111111] sm:text-3xl lg:text-[36px] lg:leading-[44px]">
              আজকের বাজারের দাম এক নজরে
            </h1>
            <p className="mb-6 max-w-xl text-xs leading-relaxed text-[#555555] sm:text-sm lg:text-[15px] lg:leading-[24px]">
              চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বোচ্চ এবং দামের পরিবর্তন এক জায়গায়।
            </p>
            <a
              href="#সব-পণ্য"
              className="inline-block rounded-lg bg-[#00875A] px-6 py-3 text-sm font-medium text-white transition-colors duration-200 ease-in-out hover:bg-[#006C48]"
            >
              সব পণ্য দেখুন
            </a>
          </div>
          <div className="mb-6 flex w-full justify-center md:mb-0 md:w-2/5 md:justify-end lg:h-full lg:items-end">
            <div className="relative h-[180px] w-[220px] sm:h-[200px] sm:w-[240px] lg:h-[240px] lg:w-[280px] lg:bottom-0">
              <Image
                src="/bazar-hero.png"
                alt="আজকের বাজারের দাম"
                fill
                sizes="(max-width: 768px) 240px, 280px"
                className="object-contain object-right-bottom"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
