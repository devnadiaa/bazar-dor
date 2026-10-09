"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  if (isPending) {
    return (
      <main className="min-h-[70vh] bg-[#FAFAFA] px-4 py-10">
        <div className="mx-auto max-w-[560px] animate-pulse rounded-2xl bg-white p-6 shadow-sm">
          <div className="h-7 w-48 rounded bg-gray-200" />
          <div className="mt-3 h-4 w-64 rounded bg-gray-200" />
          <div className="mt-8 h-12 rounded bg-gray-200" />
          <div className="mt-4 h-12 rounded bg-gray-200" />
        </div>
      </main>
    );
  }

  if (!session?.user) {
    router.replace("/signin");
    return null;
  }

  const currentName = session.user.name || "User";

  const handleUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim()) {
      toast.error("নাম লিখুন");
      return;
    }

    setLoading(true);

    const { error } = await authClient.updateUser({
      name: name.trim(),
    });

    setLoading(false);

    if (error) {
      toast.error(error.message || "তথ্য আপডেট করা যায়নি");
      return;
    }

    setName("");
    toast.success("তথ্য সফলভাবে আপডেট হয়েছে");
  };

  const handleSignOut = async () => {
    await authClient.signOut();
    toast.success("সফলভাবে সাইন আউট হয়েছে");
    router.push("/");
  };

  return (
    <main className="min-h-[70vh] bg-[#FAFAFA] px-4 py-10">
      <div className="mx-auto max-w-[560px]">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                আমার প্রোফাইল
              </h1>
              <p className="mt-1 text-sm text-gray-400">
                আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।
              </p>
            </div>

            <button
              type="button"
              onClick={handleSignOut}
              className="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-500 transition hover:bg-red-50"
            >
              ↩ সাইন আউট
            </button>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-900">
              {currentName}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {session.user.email}
            </p>
          </div>

          <div className="my-7 h-px bg-gray-100" />

          <div>
            <h2 className="text-lg font-bold text-gray-900">তথ্য</h2>

            <form onSubmit={handleUpdate} className="mt-5">
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                নাম
              </label>

              <input
                id="name"
                name="name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder={currentName}
                className="h-12 w-full rounded-lg border border-gray-200 px-4 text-sm outline-none transition focus:border-[#16A34A]"
              />

              <button
                type="submit"
                disabled={loading}
                className="mt-4 h-12 w-full rounded-lg bg-[#16A34A] text-sm font-semibold text-white transition hover:bg-[#15803D] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "আপডেট হচ্ছে..." : "আপডেট"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProfilePage;
