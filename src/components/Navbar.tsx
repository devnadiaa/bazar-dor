"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

interface Category {
  id: string | number;
  slug: string;
  nameBn: string;
  icon: string;
}

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();

  const [categories, setCategories] = useState<Category[]>([]);
  const [open, setOpen] = useState(false);
  const [banglaDate, setBanglaDate] = useState("");

  const dropdownRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "https://openapi.programming-hero.com/api/bazardor/categories"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }

        const data: Category[] = await response.json();

        if (Array.isArray(data)) {
          setCategories(data);
        }
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

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    try {
      const result = await authClient.signOut();

      if (result.error) {
        toast.error("সাইন আউট করা যায়নি");
        return;
      }

      setOpen(false);
      toast.success("সফলভাবে সাইন আউট হয়েছে");
    } catch {
      toast.error("সাইন আউট করার সময় সমস্যা হয়েছে");
    }
  };

  return (
    <nav className="w-full border-b border-[#E5E7EB] bg-white">
      <div className="mx-auto max-w-[1120px] px-6 lg:px-10">
        <div className="flex min-h-[72px] items-center justify-between gap-3">
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-600">
              <Image
                src="/logo-icon.png"
                alt="বাজার দর লোগো"
                width={28}
                height={28}
                priority
              />
            </div>

            <div className="flex flex-col">
              <span className="text-base font-bold text-gray-900 sm:text-lg">
                বাজার দর
              </span>

              <span className="text-[10px] text-gray-500 sm:text-[11px]">
                {banglaDate || "\u00A0"}
              </span>
            </div>
          </Link>

          {isPending ? (
            <div className="h-9 w-20 animate-pulse rounded-lg bg-gray-100 sm:w-28" />
          ) : session?.user ? (
            <div className="relative shrink-0" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setOpen((value) => !value)}
                aria-expanded={open}
                aria-haspopup="menu"
                className="flex items-center gap-1.5 rounded-lg px-1 py-1.5 transition hover:bg-gray-100 sm:gap-2 sm:px-2"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-green-100 text-sm font-bold text-green-700">
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      width={36}
                      height={36}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    session.user.name?.charAt(0).toUpperCase()
                  )}
                </div>

                <span className="hidden max-w-[130px] truncate text-sm font-semibold text-gray-800 sm:block">
                  {session.user.name}
                </span>

                <span className="text-xs text-gray-400">
                  {open ? "▲" : "▼"}
                </span>
              </button>

              {open && (
                <div
                  role="menu"
                  className="absolute right-0 top-12 z-50 w-48 rounded-xl border border-gray-200 bg-white p-2 shadow-lg"
                >
                  <Link
                    href="/profile"
                    role="menuitem"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <span>👤</span>
                    <span>আমার প্রোফাইল</span>
                  </Link>

                  <button
                    type="button"
                    role="menuitem"
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
            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
              <Link
                href="/signin"
                className="rounded-lg px-2 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-100 sm:px-3 sm:text-sm"
              >
                সাইন ইন
              </Link>

              <Link
                href="/signup"
                className="rounded-lg bg-green-600 px-2.5 py-2 text-xs font-medium text-white transition hover:bg-green-700 sm:px-3 sm:text-sm"
              >
                সাইন আপ
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="w-full border-y border-[#E5E7EB] bg-white">
        <div className="mx-auto max-w-[1120px] px-6 lg:px-10">
          <ul className="flex h-[46px] items-center gap-1 overflow-x-auto whitespace-nowrap">
            {categories.map((category) => {
              const isActive = pathname === `/category/${category.slug}`;

              return (
                <li key={category.id} className="shrink-0">
                  <Link
                    href={`/category/${category.slug}`}
                    aria-current={isActive ? "page" : undefined}
                    className={`flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium transition ${
                      isActive
                        ? "bg-green-50 text-green-700"
                        : "text-gray-700 hover:bg-green-50 hover:text-green-700"
                    }`}
                  >
                    <span>{category.icon}</span>
                    <span>{category.nameBn}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
}
