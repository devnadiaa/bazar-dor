"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

interface Market {
market: string;
division: string;
min: number;
max: number;
}

interface Product {
id: number;
slug: string;
nameBn: string;
category: string;
categoryNameBn: string;
categoryIcon: string;
unit: string;
image: string;
today: number;
yesterday: number;
lastWeek: number;
lastMonth: number;
change: {
dir: "up" | "down" | "flat";
pct: number;
};
markets: Market[];
}

interface ProductDetailsProps {
id: string;
}

const unitLabels: Record<string, string> = {
kg: "প্রতি কেজি",
litre: "প্রতি লিটার",
dozen: "প্রতি ডজন",
piece: "প্রতি পিস",
};

const toBanglaNumber = (value: number) => {
return value.toLocaleString("bn-BD", {
minimumFractionDigits: 0,
maximumFractionDigits: 1,
});
};

const ProductDetails = ({ id }: ProductDetailsProps) => {
const router = useRouter();
const { data: session, isPending } = authClient.useSession();

const [product, setProduct] = useState<Product | null>(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(false);

useEffect(() => {
if (isPending) {
return;
}


if (!session?.user) {
  toast.error("বিস্তারিত দেখতে আগে সাইন ইন করুন।");
  router.replace("/signin");
}


}, [session, isPending, router]);

useEffect(() => {
const fetchProduct = async () => {
try {
setLoading(true);
setError(false);


    const response = await fetch(
      `https://api.abcz.workers.dev/api/bazardor/products/${id}`
    );

    if (!response.ok) {
      throw new Error("Product not found");
    }

    const data: Product = await response.json();

    setProduct(data);
  } catch {
    setProduct(null);
    setError(true);
  } finally {
    setLoading(false);
  }
};

if (id && session?.user) {
  fetchProduct();
}


}, [id, session]);

if (isPending || !session?.user) {
return ( <main className="min-h-[70vh] bg-[#FAFAFA] py-10"> <div className="mx-auto max-w-[1120px] animate-pulse px-4 lg:px-0"> <div className="h-4 w-40 rounded bg-gray-200" />


      <div className="mt-6 h-48 rounded-2xl bg-white" />

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="h-32 rounded-xl bg-white" />
        <div className="h-32 rounded-xl bg-white" />
        <div className="h-32 rounded-xl bg-white" />
      </div>
    </div>
  </main>
);


}

if (loading) {
return ( <main className="min-h-[70vh] bg-[#FAFAFA] py-10"> <div className="mx-auto max-w-[1120px] animate-pulse px-4 lg:px-0"> <div className="h-4 w-40 rounded bg-gray-200" />


      <div className="mt-6 h-48 rounded-2xl bg-white" />

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="h-32 rounded-xl bg-white" />
        <div className="h-32 rounded-xl bg-white" />
        <div className="h-32 rounded-xl bg-white" />
      </div>

      <div className="mt-6 h-96 rounded-xl bg-white" />
    </div>
  </main>
);


}

if (error || !product) {
return ( <main className="flex min-h-[70vh] items-center justify-center bg-[#FAFAFA] px-4"> <div className="text-center"> <div className="text-5xl">📦</div>


      <h1 className="mt-4 text-xl font-bold text-gray-900">
        পণ্যের তথ্য পাওয়া যায়নি
      </h1>

      <p className="mt-2 text-sm text-gray-500">
        পণ্যটি সঠিক কিনা যাচাই করে আবার চেষ্টা করুন।
      </p>

      <Link
        href="/"
        className="mt-6 inline-flex rounded-lg bg-[#00875A] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#006C48]"
      >
        হোম পেজে ফিরে যান
      </Link>
    </div>
  </main>
);


}

const marketPrices = product.markets.map((market) => ({
...market,
average: (market.min + market.max) / 2,
}));

const minimumPrice = Math.min(
...product.markets.map((market) => market.min)
);

const maximumPrice = Math.max(
...product.markets.map((market) => market.max)
);

const averagePrice =
marketPrices.reduce((sum, market) => sum + market.average, 0) /
marketPrices.length;

const priceDifference = product.today - product.yesterday;

const isUp = product.change.dir === "up";
const isDown = product.change.dir === "down";

return ( <main className="w-full bg-[#FAFAFA] py-8 md:py-10"> <div className="mx-auto max-w-[1120px] space-y-6 px-4 lg:px-0"> <div className="flex items-center gap-2 text-sm text-gray-500"> <Link href="/" className="hover:text-[#00875A]">
হোম </Link>


      <span>›</span>

      <Link
        href={`/category/${product.category}`}
        className="hover:text-[#00875A]"
      >
        {product.categoryNameBn}
      </Link>

      <span>›</span>

      <span className="text-gray-900">{product.nameBn}</span>
    </div>

    <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm md:p-7">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-[#F0FDF4] text-4xl">
            {product.image}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
                {product.nameBn}
              </h1>

              <span className="rounded-full bg-[#E8F5E9] px-3 py-1 text-xs font-medium text-[#2E7D32]">
                {product.categoryIcon} {product.categoryNameBn}
              </span>
            </div>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              বিভিন্ন বাজারে {product.nameBn}-এর আজকের দাম ও বাজারভেদে
              মূল্য তুলনা করুন।
            </p>

            <p className="mt-2 text-sm font-medium text-gray-600">
              {unitLabels[product.unit] || `প্রতি ${product.unit}`}
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-[#F9FAFB] px-5 py-4 md:min-w-[190px]">
          <p className="text-xs text-gray-400">আজকের দাম</p>

          <p className="mt-1 text-3xl font-extrabold text-gray-900">
            {toBanglaNumber(product.today)} টাকা
          </p>

          <p
            className={`mt-1 text-sm font-semibold ${
              isUp
                ? "text-red-500"
                : isDown
                  ? "text-green-600"
                  : "text-gray-500"
            }`}
          >
            {isUp ? "▲" : isDown ? "▼" : "—"}{" "}
            {toBanglaNumber(Math.abs(product.change.pct))}%

            <span className="ml-1 font-normal text-gray-400">
              গতকালের তুলনায়
            </span>
          </p>
        </div>
      </div>
    </section>

    <section>
      <h2 className="mb-4 text-xl font-bold text-gray-900">
        মূল্য সংক্ষেপ
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-100 bg-white p-5">
          <p className="text-sm text-gray-500">সর্বনিম্ন দাম</p>

          <p className="mt-2 text-2xl font-bold text-gray-900">
            {toBanglaNumber(minimumPrice)} টাকা
          </p>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-5">
          <p className="text-sm text-gray-500">সর্বোচ্চ দাম</p>

          <p className="mt-2 text-2xl font-bold text-gray-900">
            {toBanglaNumber(maximumPrice)} টাকা
          </p>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-5">
          <p className="text-sm text-gray-500">গড় দাম</p>

          <p className="mt-2 text-2xl font-bold text-gray-900">
            {toBanglaNumber(Math.round(averagePrice))} টাকা
          </p>
        </div>
      </div>
    </section>

    <section className="rounded-xl border border-gray-100 bg-white">
      <div className="border-b border-gray-100 p-5">
        <h2 className="text-xl font-bold text-gray-900">
          বাজারভিত্তিক আজকের দাম
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          {toBanglaNumber(product.markets.length)}টি বাজারের সর্বনিম্ন ও
          সর্বোচ্চ দাম
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] text-left">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="px-5 py-4 text-sm font-semibold text-gray-600">
                বাজার
              </th>

              <th className="px-5 py-4 text-sm font-semibold text-gray-600">
                বিভাগ
              </th>

              <th className="px-5 py-4 text-sm font-semibold text-gray-600">
                সর্বনিম্ন
              </th>

              <th className="px-5 py-4 text-sm font-semibold text-gray-600">
                সর্বোচ্চ
              </th>

              <th className="px-5 py-4 text-sm font-semibold text-gray-600">
                গড়
              </th>
            </tr>
          </thead>

          <tbody>
            {marketPrices.map((market) => (
              <tr
                key={`${market.market}-${market.division}`}
                className="border-b border-gray-50 last:border-0"
              >
                <td className="px-5 py-4 text-sm font-medium text-gray-900">
                  {market.market}
                </td>

                <td className="px-5 py-4 text-sm text-gray-500">
                  {market.division}
                </td>

                <td className="px-5 py-4 text-sm font-semibold text-green-600">
                  {toBanglaNumber(market.min)} টাকা
                </td>

                <td className="px-5 py-4 text-sm font-semibold text-red-500">
                  {toBanglaNumber(market.max)} টাকা
                </td>

                <td className="px-5 py-4 text-sm font-semibold text-gray-900">
                  {toBanglaNumber(Math.round(market.average))} টাকা
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>

    <section className="rounded-xl border border-gray-100 bg-white p-5">
      <h2 className="text-lg font-bold text-gray-900">
        দামের পরিবর্তন
      </h2>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <p className="text-xs text-gray-400">গতকাল</p>

          <p className="mt-1 font-bold text-gray-900">
            {toBanglaNumber(product.yesterday)} টাকা
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-400">আজ</p>

          <p className="mt-1 font-bold text-gray-900">
            {toBanglaNumber(product.today)} টাকা
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-400">পরিবর্তন</p>

          <p
            className={`mt-1 font-bold ${
              priceDifference > 0
                ? "text-red-500"
                : priceDifference < 0
                  ? "text-green-600"
                  : "text-gray-500"
            }`}
          >
            {priceDifference > 0 ? "+" : ""}
            {toBanglaNumber(priceDifference)} টাকা
          </p>
        </div>
      </div>
    </section>
  </div>
</main>


);
};

export default ProductDetails;
