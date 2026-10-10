"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";

export default function AuthToast() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/") {
      const message = sessionStorage.getItem("auth-toast");

      if (message) {
        sessionStorage.removeItem("auth-toast");
        setTimeout(() => {
          toast.success(message, { duration: 3000 });
        }, 300);
      }
    }
  }, [pathname]);

  return null;
}
