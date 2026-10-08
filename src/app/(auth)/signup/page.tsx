"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUp } from "@/lib/auth-client";

const SignUpPage = () => {
const router = useRouter();
const [errorMessage, setErrorMessage] = useState("");
const [loading, setLoading] = useState(false);

const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
event.preventDefault();


setErrorMessage("");
setLoading(true);

const formData = new FormData(event.currentTarget);

const name = formData.get("name") as string;
const email = formData.get("email") as string;
const password = formData.get("password") as string;
const confirmPassword = formData.get("confirmPassword") as string;

if (password !== confirmPassword) {
  setErrorMessage("পাসওয়ার্ড দুটি মিলছে না।");
  setLoading(false);
  return;
}

const { error } = await signUp.email({
  name,
  email,
  password,
});

setLoading(false);

if (error) {
  setErrorMessage(error.message || "অ্যাকাউন্ট তৈরি করা যায়নি।");
  return;
}

router.push("/signin");


};

return ( <main className="flex min-h-[70vh] flex-col items-center justify-center bg-[#FAFAFA] px-4 py-10"> <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8"> <div className="mb-6 text-center"> <h1 className="text-2xl font-bold text-gray-900">
অ্যাকাউন্ট তৈরি করুন </h1>


      <p className="mt-2 text-sm text-gray-500">
        বাজার দর-এ শুরু করতে আপনার অ্যাকাউন্ট তৈরি করুন
      </p>
    </div>

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
          placeholder="আপনার নাম লিখুন"
          className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#00875A]"
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
          placeholder="আপনার ইমেইল লিখুন"
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
        {loading ? "অ্যাকাউন্ট তৈরি হচ্ছে..." : "অ্যাকাউন্ট তৈরি করুন"}
      </button>
    </form>

    <p className="mt-6 text-center text-sm text-gray-500">
      ইতিমধ্যে অ্যাকাউন্ট আছে?{" "}
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
    ← হোম পেজে ফিরে যান
  </Link>
</main>


);
};

export default SignUpPage;
