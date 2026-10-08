"use client";

import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  const categories = [
    { name: "চাল", icon: "🍚", slug: "chal" },
    { name: "ডাল", icon: "🫘", slug: "dal" },
    { name: "তেল", icon: "🛢️", slug: "tel" },
    { name: "সবজি", icon: "🥬", slug: "sobji" },
    { name: "মাছ", icon: "🐟", slug: "mach" },
    { name: "মাংস", icon: "🍗", slug: "mangsho" },
    { name: "ডিম-দুধ", icon: "🥛", slug: "dim-dui" },
    { name: "মসলা", icon: "🌶️", slug: "mosla" },
  ];

  return (
    <nav className="w-full border-b bg-white">
      <div className="mx-auto max-w-[1120px] px-4">
        <div className="flex h-[72px] items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-600">
              <Image
                src="/logo-icon.png"
                alt="বাজার দর লোগো"
                width={28}
                height={28}
              />
            </div>

            <div className="flex flex-col">
              <span className="text-lg font-bold text-gray-900">
                বাজার দর
              </span>

              <span className="text-[11px] text-gray-500">
                মঙ্গলবার, ৬ অক্টোবর, ২০২৬
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/signin"
              className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              সাইন ইন
            </Link>

            <Link
              href="/signup"
              className="rounded-lg bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700"
            >
              সাইন আপ
            </Link>
          </div>
        </div>

        <div className="h-[46px]">
          <ul className="flex h-full items-center gap-1 overflow-x-auto">
            {categories.map((category) => (
              <li key={category.slug}>
                <Link
                  href={`/category/${category.slug}`}
                  className="flex items-center gap-1 whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-700"
                >
                  <span>{category.icon}</span>
                  <span>{category.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
