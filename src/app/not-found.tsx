import Link from "next/link";

export default function NotFound() {
return ( <main className="flex min-h-[70vh] w-full items-center justify-center bg-[#FAFAFA] px-4 py-12"> <div className="text-center"> <div className="text-7xl">🔎</div>


    <p className="mt-5 text-sm font-semibold text-[#00875A]">
      404
    </p>

    <h1 className="mt-2 text-2xl font-bold text-gray-900 md:text-3xl">
      পেজটি পাওয়া যায়নি
    </h1>

    <p className="mt-2 text-sm text-gray-500">
      আপনি যে পেজটি খুঁজছেন সেটি নেই অথবা ঠিকানা পরিবর্তন করা হয়েছে।
    </p>

    <Link
      href="/"
      className="mt-6 inline-flex rounded-lg bg-[#00875A] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#006C48]"
    >
      হোম পেজে ফিরে যান
    </Link>
  </div>
</main>


);
}
