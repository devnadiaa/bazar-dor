import Image from "next/image";

export default function Home() {
  return (
    <>
      {/* Outer Banner Wrapper with Light Grid / Dotted Line Borders like Figma */}
      <section className="w-full bg-white py-6 md:py-10">
        <div className="mx-auto max-w-[1120px] px-4 lg:px-0">
          
          {/* Main Content Box with Light Border and Rounded Corner */}
          <div className="flex flex-col-reverse items-center justify-between rounded-xl border border-[#B2E3D2] bg-[#FAFAFA] p-6 sm:p-8 md:flex-row md:items-center md:p-10 lg:h-[283px] lg:p-0 lg:pl-12 lg:pr-8">
            
            {/* Left Content Column */}
            <div className="w-full text-left md:w-3/5">
              {/* Eyebrow Tag / Date */}
              <div className="mb-3 inline-block rounded-full bg-[#EBF7F2] px-3 py-1 text-xs font-medium text-[#00875A] md:text-sm">
                মঙ্গলবার, ৬ অক্টোবর, ২০২৬
              </div>

              {/* Main Heading */}
              <h1 className="mb-3 text-2xl font-bold tracking-tight text-[#111111] sm:text-3xl lg:text-4xl">
                আজকের বাজারের দাম এক নজরে
              </h1>

              {/* Subtitle */}
              <p className="mb-5 max-w-xl text-xs leading-relaxed text-[#555555] sm:text-sm lg:text-base">
                চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক
                বিস্তারিত, গড়, সর্বনিম্ন-সর্বোচ্চ এবং দামের পরিবর্তন এক জায়গায়।
              </p>

              {/* Primary CTA Button */}
              <a
                href="#সব-পণ্য"
                className="inline-block rounded-md bg-[#00875A] px-5 py-2.5 text-sm font-medium text-white transition-colors duration-200 ease-in-out hover:bg-[#006C48]"
              >
                সব পণ্য দেখুন
              </a>
            </div>

            {/* Right Image Column */}
            <div className="mb-6 flex w-full justify-center md:mb-0 md:w-2/5 md:justify-end">
              <div className="relative h-[180px] w-[220px] sm:h-[200px] sm:w-[240px] lg:h-[220px] lg:w-[260px]">
                <Image
                  src="/bazar-hero.png"
                  alt="আজকের বাজারের দাম"
                  fill
                  sizes="(max-width: 768px) 240px, 260px"
                  className="object-contain object-right-bottom"
                  priority
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Target Section for smooth scroll */}
      <section id="সব-পণ্য" className="scroll-mt-10"></section>
    </>
  );
}
