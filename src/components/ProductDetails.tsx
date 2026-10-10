"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
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
  const hasShownToast = useRef(false);
  const { data: session, isPending } = authClient.useSession();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (isPending) {
      return;
    }

    if (!session?.user) {
      if (!hasShownToast.current) {
        hasShownToast.current = true;
        toast.error("বিস্তারিত দেখতে আগে সাইন ইন করুন।", {
          id: "product-details-signin",
        });
      }

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
    return (
      <main className="min-h-[70vh] bg-[#FAFAFA] py-8">
        <div className="mx-auto max-w-[1000px] animate-pulse space-y-4 px-4">
          <div className="h-4 w-32 rounded bg-gray-200" />
          <div className="h-36 rounded-xl bg-white" />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="h-24 rounded-xl bg-white" />
            <div className="h-24 rounded-xl bg-white" />
            <div className="h-24 rounded-xl bg-white" />
          </div>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="min-h-[70vh] bg-[#FAFAFA] py-8">
        <div className="mx-auto max-w-[1000px] animate-pulse space-y-4 px-4">
          <div className="h-4 w-32 rounded bg-gray-200" />
          <div className="h-36 rounded-xl bg-white" />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="h-24 rounded-xl bg-white" />
            <div className="h-24 rounded-xl bg-white" />
            <div className="h-24 rounded-xl bg-white" />
          </div>

          <div className="h-64 rounded-xl bg-white" />
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#FAFAFA] px-4">
        <div className="text-center">
          <div className="text-4xl">📦</div>

          <h1 className="mt-3 text-lg font-bold text-gray-900">
            পণ্যের তথ্য পাওয়া যায়নি
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            পণ্যটি সঠিক কিনা যাচাই করে আবার চেষ্টা করুন।
          </p>

          <Link
            href="/"
            className="mt-4 inline-flex rounded-lg bg-[#00875A] px-4 py-2 text-sm font-medium text-white hover:bg-[#006C48]"
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

  const minimumPrice = product.markets.length
    ? Math.min(...product.markets.map((market) => market.min))
    : 0;

  const maximumPrice = product.markets.length
    ? Math.max(...product.markets.map((market) => market.max))
    : 0;

  const averagePrice = marketPrices.length
    ? marketPrices.reduce((sum, market) => sum + market.average, 0) /
      marketPrices.length
    : 0;

  const lowestPriceMarket = product.markets.reduce<Market | null>(
    (lowest, market) => {
      if (!lowest || market.min < lowest.min) {
        return market;
      }

      return lowest;
    },
    null
  );

  const highestPriceMarket = product.markets.reduce<Market | null>(
    (highest, market) => {
      if (!highest || market.max > highest.max) {
        return market;
      }

      return highest;
    },
    null
  );

  const isUp = product.change.dir === "up";
  const isDown = product.change.dir === "down";

  const priceDifference = Math.abs(product.today - product.yesterday);

  const changeLabel = isUp
    ? "বেড়েছে"
    : isDown
      ? "কমেছে"
      : "অপরিবর্তিত";

  const changeColor = isUp
    ? "text-red-600"
    : isDown
      ? "text-green-600"
      : "text-gray-600";

  const changeSymbol = isUp ? "▲" : isDown ? "▼" : "—";

  const unitLabel = unitLabels[product.unit] || `প্রতি ${product.unit}`;

  return (
    <main className="w-full bg-[#FAFAFA] py-6 md:py-8">
      <div className="mx-auto max-w-[1000px] space-y-5 px-4">
        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 sm:text-sm">
          <Link href="/" className="hover:text-[#00875A]">
            হোম
          </Link>

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

        <section className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm md:p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-[1fr_auto] sm:items-center">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#F0FDF4] text-3xl">
                {product.image || product.categoryIcon}
              </div>

              <div className="min-w-0">
                <h1 className="text-xl font-bold leading-tight text-gray-900 md:text-2xl">
                  {product.nameBn}
                </h1>

                <p className="mt-2 text-sm font-normal text-gray-500">
                  {unitLabel} <span className="mx-1">·</span>{" "}
                  {product.categoryNameBn}
                </p>

                <p className="mt-3 text-sm text-gray-700">
                  গতকালের তুলনায় আজ দাম{" "}
                  <span className={`font-semibold ${changeColor}`}>
                    {changeLabel}
                  </span>
                  <span className="mx-1">·</span>
                  {toBanglaNumber(priceDifference)} টাকা
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-gray-100 bg-[#F9FAFB] px-5 py-4 sm:min-w-[200px]">
              <p className="text-sm font-normal text-gray-500">আজকের দাম</p>

              <p className="mt-1 text-3xl font-extrabold leading-tight text-gray-900">
                {toBanglaNumber(product.today)}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                টাকা / {product.unit === "kg" ? "কেজি" : product.unit === "litre" ? "লিটার" : product.unit === "dozen" ? "ডজন" : "পিস"}
              </p>

              <p className={`mt-3 flex items-center gap-2 ${changeColor}`}>
                <span className="text-sm font-bold">{changeSymbol}</span>

                <span className="text-base font-bold">
                  {toBanglaNumber(Math.abs(product.change.pct))}%
                </span>
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-[#F3F5F4] p-4 md:p-5">
          <div>
            <h2 className="text-lg font-bold text-gray-900">মূল্য সংক্ষেপ</h2>

            <p className="mt-1 text-xs text-gray-500 sm:text-sm">
              বিভিন্ন বাজারের দামের সংক্ষিপ্ত হিসাব
            </p>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <p className="text-sm font-normal text-gray-500">
                সর্বনিম্ন দাম
              </p>

              <p className="mt-2 text-xl font-bold text-green-600">
                <span className="text-2xl font-extrabold">
                  {toBanglaNumber(minimumPrice)}
                </span>{" "}
                টাকা
              </p>

              <p className="mt-1 text-xs font-normal text-gray-400">
                {lowestPriceMarket?.market || "সবচেয়ে কম দামের বাজার"}
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <p className="text-sm font-normal text-gray-500">
                সর্বোচ্চ দাম
              </p>

              <p className="mt-2 text-xl font-bold text-red-500">
                <span className="text-2xl font-extrabold">
                  {toBanglaNumber(maximumPrice)}
                </span>{" "}
                টাকা
              </p>

              <p className="mt-1 text-xs font-normal text-gray-400">
                {highestPriceMarket?.market || "সবচেয়ে বেশি দামের বাজার"}
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <p className="text-sm font-normal text-gray-500">গড় দাম</p>

              <p className="mt-2 text-xl font-bold text-green-600">
                <span className="text-2xl font-extrabold">
                  {toBanglaNumber(Math.round(averagePrice))}
                </span>{" "}
                টাকা
              </p>

              <p className="mt-1 text-xs font-normal text-gray-400">
                সব বাজারের গড় মূল্য
              </p>
            </div>
          </div>

          <section className="mt-4 overflow-hidden rounded-lg border border-gray-200 bg-white">
            <div className="border-b border-gray-100 px-4 py-3">
              <h2 className="text-base font-bold text-gray-900 sm:text-lg">
                বাজারভিত্তিক আজকের দাম
              </h2>

              <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                {toBanglaNumber(product.markets.length)}টি বাজারের সর্বনিম্ন ও
                সর্বোচ্চ দাম
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px] text-left">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="px-4 py-3 text-xs font-semibold text-gray-600 sm:text-sm">
                      বাজার
                    </th>

                    <th className="px-4 py-3 text-xs font-semibold text-gray-600 sm:text-sm">
                      বিভাগ
                    </th>

                    <th className="px-4 py-3 text-xs font-semibold text-gray-600 sm:text-sm">
                      সর্বনিম্ন
                    </th>

                    <th className="px-4 py-3 text-xs font-semibold text-gray-600 sm:text-sm">
                      সর্বোচ্চ
                    </th>

                    <th className="px-4 py-3 text-xs font-semibold text-gray-600 sm:text-sm">
                      গড়
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {marketPrices.map((market) => (
                    <tr
                      key={`${market.market}-${market.division}`}
                      className="border-b border-gray-100 last:border-0"
                    >
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {market.market}
                      </td>

                      <td className="px-4 py-3 text-sm text-gray-900">
                        {market.division}
                      </td>

                      <td className="px-4 py-3 text-sm text-gray-900">
                        {toBanglaNumber(market.min)} টাকা
                      </td>

                      <td className="px-4 py-3 text-sm text-gray-900">
                        {toBanglaNumber(market.max)} টাকা
                      </td>

                      <td className="px-4 py-3 text-sm text-gray-900">
                        {toBanglaNumber(Math.round(market.average))} টাকা
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </section>
      </div>
    </main>
  );
};

export default ProductDetails;
