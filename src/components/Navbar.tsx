"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { authClient } from "@/lib/auth-client";

interface Category {
id: string;
slug: string;
nameBn: string;
icon: string;
}

const Navbar = () => {
const { data: session, isPending } = authClient.useSession();

const [categories, setCategories] = useState<Category[]>([]);
const [open, setOpen] = useState(false);

const dropdownRef = useRef<HTMLDivElement>(null);

useEffect(() => {
const fetchCategories = async () => {
try {
const response = await fetch(
"https://api.abcz.workers.dev/api/bazardor/categories"
);


    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }

    const data: Category[] = await response.json();

    setCategories(data);
  } catch {
    setCategories([]);
  }
};

fetchCategories();


}, []);

useEffect(() => {
const handleClickOutside = (event: MouseEvent) => {
if (
dropdownRef.current &&
!dropdownRef.current.contains(event.target as Node)
) {
setOpen(false);
}
};


document.addEventListener("mousedown", handleClickOutside);

return () => {
  document.removeEventListener("mousedown", handleClickOutside);
};


}, []);

const handleSignOut = async () => {
await authClient.signOut();
setOpen(false);
};

return ( <nav className="w-full border-b bg-white"> <div className="mx-auto max-w-[1120px] px-4"> <div className="flex h-[72px] items-center justify-between"> <Link href="/" className="flex items-center gap-2"> <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-600"> <Image
             src="/logo-icon.png"
             alt="বাজার দর লোগো"
             width={28}
             height={28}
           /> </div>


        <div className="flex flex-col">
          <span className="text-lg font-bold text-gray-900">
            বাজার দর
          </span>

          <span className="text-[11px] text-gray-500">
            মঙ্গলবার, ৬ অক্টোবর, ২০২৬
          </span>
        </div>
      </Link>

      {isPending ? (
        <div className="h-9 w-28 animate-pulse rounded-lg bg-gray-100" />
      ) : session?.user ? (
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition hover:bg-gray-100"
          >
            <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-green-100 text-sm font-bold text-green-700">
              {session.user.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name}
                  width={36}
                  height={36}
                  className="h-full w-full object-cover"
                />
              ) : (
                session.user.name?.charAt(0).toUpperCase()
              )}
            </div>

            <span className="max-w-[130px] truncate text-sm font-semibold text-gray-800">
              {session.user.name}
            </span>

            <span className="text-xs text-gray-400">
              {open ? "▲" : "▼"}
            </span>
          </button>

          {open && (
            <div className="absolute right-0 top-12 z-50 w-48 rounded-xl border border-gray-100 bg-white p-2 shadow-lg">
              <Link
                href="/profile"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <span>👤</span>
                <span>আমার প্রোফাইল</span>
              </Link>

              <button
                type="button"
                onClick={handleSignOut}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <span>↩</span>
                <span>সাইন আউট</span>
              </button>
            </div>
          )}
        </div>
      ) : (
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
      )}
    </div>

    <div className="h-[46px]">
      <ul className="flex h-full items-center gap-1 overflow-x-auto">
        {categories.map((category) => (
          <li key={category.id}>
            <Link
              href={`/category/${category.slug}`}
              className="flex items-center gap-1 whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-700"
            >
              <span>{category.icon}</span>
              <span>{category.nameBn}</span>
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
