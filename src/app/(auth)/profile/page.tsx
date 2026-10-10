"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import Image from "next/image";

const ProfilePage = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.replace("/signin");
    }
  }, [isPending, session, router]);

  if (isPending || !session?.user) {
    return (
      <main className="min-h-[70vh] bg-[#F8F9FA] px-4 py-10">
        <div className="mx-auto max-w-[800px] space-y-6">
          <div className="animate-pulse rounded-2xl bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <div className="h-7 w-48 rounded bg-gray-200" />
            <div className="mt-3 h-4 w-64 rounded bg-gray-200" />
          </div>
          <div className="h-40 animate-pulse rounded-2xl bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]" />
        </div>
      </main>
    );
  }

  const currentName = session.user.name || "User";
  const userImage = session.user.image || "/avatar-placeholder.png";

  const handleUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim()) {
      toast.error("নাম লিখুন");
      return;
    }

    setLoading(true);

    try {
      const { error } = await authClient.updateUser({
        name: name.trim(),
      });

      if (error) {
        toast.error(error.message || "তথ্য আপডেট করা যায়নি");
        return;
      }

      setName("");
      toast.success("তথ্য সফলভাবে আপডেট হয়েছে");
    } catch {
      toast.error("তথ্য আপডেট করা যায়নি");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await authClient.signOut();

      if (error) {
        toast.error("সাইন আউট করা যায়নি");
        return;
      }

      toast.success("সফলভাবে সাইন আউট হয়েছে");
      router.push("/");
    } catch {
      toast.error("সাইন আউট করা যায়নি");
    }
  };

  return (
    <main className="min-h-screen bg-[#F8F9FA] px-4 py-10 font-sans antialiased">
      <div className="mx-auto max-w-[880px] space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">
            আমার প্রোফাইল
          </h1>
          <p className="mt-1 text-sm text-[#737373]">
            আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।
          </p>
        </div>

        <div className="flex flex-col gap-4 rounded-2xl border border-[#F0F0F0] bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.02)] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-gray-100">
              <Image
                src={userImage}
                alt={currentName}
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#1A1A1A]">
                {currentName}
              </h2>
              <p className="text-sm text-[#737373]">
                {session.user.email}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            className="flex items-center justify-center gap-1.5 self-start rounded-xl border border-[#FEE2E2] px-4 py-2.5 text-sm font-medium text-[#DC2626] transition hover:bg-[#FEF2F2] sm:self-center"
          >
            <span className="text-base">←</span> সাইন আউট
          </button>
        </div>

        <div className="rounded-2xl border border-[#F0F0F0] bg-white p-8 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          <h3 className="text-lg font-bold text-[#1A1A1A]">তথ্য</h3>

          <form onSubmit={handleUpdate} className="mt-6">
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-[#404040]"
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
                className="h-12 w-full rounded-xl border border-[#E5E5E5] bg-[#FAFAFA] px-4 text-sm text-[#1A1A1A] outline-none transition placeholder:text-[#A3A3A3] focus:border-[#10B981] focus:bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 h-12 w-full rounded-xl bg-[#009963] text-sm font-semibold text-white transition hover:bg-[#008052] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "আপডেট হচ্ছে..." : "আপডেট"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default ProfilePage;
