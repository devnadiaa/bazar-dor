"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "@/lib/auth-client";

const SignInPage = () => {
const router = useRouter();
const [errorMessage, setErrorMessage] = useState("");
const [loading, setLoading] = useState(false);

const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
event.preventDefault();


setErrorMessage("");
setLoading(true);

const formData = new FormData(event.currentTarget);

const email = formData.get("email") as string;
const password = formData.get("password") as string;

const { error } = await signIn.email({
  email,
  password,
});

setLoading(false);

if (error) {
  setErrorMessage(
    error.message || "ইমেইল অথবা পাসওয়ার্ড সঠিক নয়।"
  );
  return;
}

router.push("/");


};

const handleSocialSignIn = (provider: "google" | "github") => {
setErrorMessage(
provider === "google"
? "Google দিয়ে সাইন ইন এখনো সেটআপ করা হয়নি।"
: "GitHub দিয়ে সাইন ইন এখনো সেটআপ করা হয়নি।"
);
};

return ( <main className="flex min-h-[70vh] flex-col items-center justify-center bg-[#FAFAFA] px-4 py-10"> <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8"> <div className="mb-6 text-center"> <h1 className="text-2xl font-bold text-gray-900">
সাইন ইন </h1>


      <p className="mt-2 text-sm text-gray-500">
        বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্টে ঢুকুন।
      </p>
    </div>

    <form onSubmit={onSubmit} className="space-y-4">
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
          className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#00875A]"
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
          className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#00875A]"
        />
      </div>

      {errorMessage && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-[#00875A] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#006C48] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "সাইন ইন হচ্ছে..." : "সাইন ইন"}
      </button>
    </form>

    <div className="my-5 flex items-center gap-3">
      <div className="h-px flex-1 bg-gray-200" />
      <span className="text-xs text-gray-400">অথবা</span>
      <div className="h-px flex-1 bg-gray-200" />
    </div>

    <div className="space-y-3">
      <button
        type="button"
        onClick={() => handleSocialSignIn("google")}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
      >
        <span className="text-base">G</span>
        Google দিয়ে চালিয়ে যান
      </button>

      <button
        type="button"
        onClick={() => handleSocialSignIn("github")}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
      >
        <span className="text-base">●</span>
        GitHub দিয়ে চালিয়ে যান
      </button>
    </div>

    <p className="mt-6 text-center text-sm text-gray-500">
      অ্যাকাউন্ট নেই?{" "}
      <Link
        href="/signup"
        className="font-medium text-[#00875A] hover:underline"
      >
        সাইন আপ করুন
      </Link>
    </p>
  </div>

  <Link
    href="/"
    className="mt-5 text-sm font-medium text-gray-500 transition hover:text-[#00875A]"
  >
    ← হোম পেজে ফিরে যান
  </Link>
</main>


);
};

export default SignInPage;
