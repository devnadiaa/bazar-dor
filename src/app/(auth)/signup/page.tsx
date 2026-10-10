"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { signIn, signUp } from "@/lib/auth-client";

const SignUpPage = () => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setErrorMessage("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);

    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(
      formData.get("confirmPassword") ?? ""
    );

    if (password !== confirmPassword) {
      setErrorMessage("পাসওয়ার্ড দুটি মিলছে না।");
      setLoading(false);
      return;
    }

    try {
      const { error } = await signUp.email({
        name,
        email,
        password,
      });

      if (error) {
        setErrorMessage(
          error.message || "অ্যাকাউন্ট তৈরি করা যায়নি।"
        );
        return;
      }

      toast.success("অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!", {
        duration: 3000,
      });

      router.replace("/");
      router.refresh();
    } catch {
      setErrorMessage(
        "অ্যাকাউন্ট তৈরি করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignIn = async (
    provider: "google" | "github"
  ) => {
    setErrorMessage("");
    setSocialLoading(true);

    sessionStorage.setItem(
      "auth-toast",
      "সফলভাবে সাইন ইন হয়েছে!"
    );

    try {
      const { error } = await signIn.social({
        provider,
        callbackURL: "/",
      });

      if (error) {
        sessionStorage.removeItem("auth-toast");

        setErrorMessage(
          provider === "google"
            ? "Google দিয়ে সাইন ইন করা যায়নি।"
            : "GitHub দিয়ে সাইন ইন করা যায়নি।"
        );
      }
    } catch {
      sessionStorage.removeItem("auth-toast");

      setErrorMessage(
        "সাইন ইন করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।"
      );
    } finally {
      setSocialLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#FAFAFA] px-4 py-10">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900">
          অ্যাকাউন্ট তৈরি করুন
        </h1>

        <p className="mt-1.5 text-sm text-gray-500">
          বিনা খরচে সাইন আপ করে সব বিস্তারিত দাম দেখুন।
        </p>
      </div>

      <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              নাম
            </label>

            <input
              id="name"
              name="name"
              type="text"
              required
              minLength={3}
              placeholder="Your name"
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-[#00875A]"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              ইমেইল
            </label>

            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-[#00875A]"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              পাসওয়ার্ড
            </label>

            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              placeholder="কমপক্ষে ৮ অক্ষর"
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-[#00875A]"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              পাসওয়ার্ড নিশ্চিত করুন
            </label>

            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              minLength={8}
              placeholder="আবার লিখুন"
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-[#00875A]"
            />
          </div>

          {errorMessage && (
            <p
              role="alert"
              className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600"
            >
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || socialLoading}
            className="w-full rounded-lg bg-[#00875A] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#006C48] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "অ্যাকাউন্ট তৈরি হচ্ছে..."
              : "অ্যাকাউন্ট তৈরি করুন"}
          </button>
        </form>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs text-gray-400">অথবা</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleSocialSignIn("google")}
            disabled={loading || socialLoading}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-[13px] font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <svg
              className="h-4 w-4 shrink-0"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fill="#EA4335"
                d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582l3.51-3.51C17.842 1.05 15.092 0 12 0 7.354 0 3.373 2.667 1.455 6.556l3.81 3.209Z"
              />
              <path
                fill="#FBBC05"
                d="M1.455 6.556A7.054 7.054 0 0 0 1 9.091c0 .873.16 1.706.455 2.478l3.81-3.21a6.892 6.892 0 0 1 0-1.803l-3.81-3.209Z"
              />
              <path
                fill="#4285F4"
                d="M12 24c3.436 0 6.316-1.135 8.422-3.082l-3.845-2.982c-1.127.755-2.564 1.205-4.577 1.205-3.527 0-6.527-2.382-7.59-5.59L1.573 16.76C3.545 21.055 7.427 24 12 24Z"
              />
              <path
                fill="#34A853"
                d="M23.59 12.218c0-.79-.07-1.554-.2-2.29H12v4.364h6.509a5.564 5.564 0 0 1-2.418 3.655l3.845 2.982c2.25-2.073 3.654-5.118 3.654-8.71Z"
              />
            </svg>

            <span className="truncate">
              Google দিয়ে চালিয়ে যান
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleSocialSignIn("github")}
            disabled={loading || socialLoading}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-[13px] font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <svg
              className="h-4 w-4 shrink-0"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z"
              />
            </svg>

            <span className="truncate">
              GitHub দিয়ে চালিয়ে যান
            </span>
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-gray-500">
          অ্যাকাউন্ট আছে?{" "}
          <Link
            href="/signin"
            className="font-medium text-[#00875A] hover:underline"
          >
            সাইন ইন করুন
          </Link>
        </p>
      </div>

      <Link
        href="/"
        className="mt-5 text-sm font-medium text-gray-500 transition hover:text-[#00875A]"
      >
        — হোম পেজে ফিরে যান
      </Link>
    </main>
  );
};

export default SignUpPage;
