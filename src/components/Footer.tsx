export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-100 bg-white py-5">
      <div className="mx-auto flex max-w-[1120px] flex-col items-center justify-between gap-3 px-4 text-center sm:px-6 md:flex-row md:text-left lg:px-0">
        <p className="text-xs font-medium text-gray-500 md:text-sm">
          বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে।
        </p>

        <p className="text-xs text-gray-400 md:text-sm">
          সকল দাম সম্ভাব্য, বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।
        </p>
      </div>
    </footer>
  );
}
