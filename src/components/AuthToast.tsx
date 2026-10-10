"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

export default function AuthToast() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/") {
      return;
    }

    const message = sessionStorage.getItem("auth-toast");

    if (message) {
      sessionStorage.removeItem("auth-toast");

      toast.success(message, {
        duration: 3000,
        position: "top-center",
      });
    }
  }, [pathname]);

  return <Toaster position="top-center" />;
}
