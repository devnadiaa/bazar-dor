"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

interface Product {
  id: number;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn: string;
  categoryIcon: string;
  unit: string;
  today: number;
  yesterday: number;
  lastWeek: number;
  lastMonth: number;
  change: {
    dir: "up" | "down" | "flat";
    pct: number;
  };
}

interface Category {
  id: string | number;
  slug: string;
  nameBn: string;
  icon: string;
}

type SortOption = "default" | "low" | "high";

interface CategoryProductsProps {
  slug: string;
}

const unitLabels: Record<string, string> = {
  kg: "প্রতি কেজি",
  litre: "প্রতি লিটার",
  dozen: "প্রতি ডজন",
  piece: "প্রতি পিস",
};

const toBanglaNumber = (value: number): string => {
  return value.toLocaleString("bn-BD", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  });
};

function getProductIcon(nameBn: string, categoryIcon: string) {
  if (nameBn.includes("চাল")) return "🍚";
  if (
    nameBn.includes("ডাল") ||
    nameBn.includes("ছোলা")
  ) {
    return "🫘";
  }
  if (nameBn.includes("সরিষার তেল")) return "🫙";
  if (nameBn.includes("পাম তেল")) return "🛢️";

  if (nameBn.includes("আলু")) return "🥔";
  if (nameBn.includes("পেঁয়াজ") || nameBn.includes("পিঁয়াজ")) {
    return "🧅";
  }
  if (nameBn.includes("কাঁচামরিচ")) return "🌶️";
  if (nameBn.includes("বেগুন")) return "🍆";
  if (nameBn.includes("ঢেঁড়স")) return "🥬";

  if (nameBn.includes("রুই মাছ")) return "🐟";
  if (nameBn.includes("তেলাপিয়া")) return "🐠";
  if (nameBn.includes("ইলিশ মাছ")) return "🐟";
  if (nameBn.includes("কাতলা মাছ")) return "🐡";
  if (nameBn.includes("চিংড়ি মাছ")) return "🦐";

  if (nameBn.includes("মুরগির মাংস")) return "🍗";
  if (nameBn.includes("গরুর মাংস")) return "🥩";
  if (nameBn.includes("খাসির মাংস")) return "🍖";
  if (nameBn.includes("হাঁসের মাংস")) return "🦆";

  if (nameBn.includes("ডিম")) return "🥚";
  if (nameBn.includes("দুধ")) return "🥛";
  if (nameBn.includes("দই")) return "🥣";
  if (nameBn.includes("মাখন")) return "🧈";

  if (nameBn.includes("আদা")) return "🫚";
  if (nameBn.includes("রসুন")) return "🧄";
  if (nameBn.includes("মরিচ গুঁড়া")) return "🌶️";
  if (nameBn.includes("ধনেপাতা গুঁড়া")) return "🌿";

  return categoryIcon;
}

const ProductCard = ({ product }: { product: Product }) => {
  const isUp = product.change.dir === "up";
  const isDown = product.change.dir === "down";

  return (
    <Link
      href={`/product/${product.id}`}
      className="block rounded-xl border border-gray-100 bg-white p-5 transition-all hover:border-gray-200 hover:shadow-sm"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#F4F6F8] text-2xl">
          {getProductIcon(product.nameBn, product.categoryIcon)}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-bold leading-snug text-gray-900">
            {product.nameBn}
          </h3>

          <p className="mt-0.5 text-xs text-gray-400">
            {unitLabels[product.unit] || `প্রতি ${product.unit}`}
          </p>

          <div className="mt-4 flex items-end justify-between">
            <div>
              <p className="text-[11px] font-medium tracking-wide text-gray-400">
                আজকের দাম
              </p>

              <p className="mt-0.5 text-lg font-extrabold text-gray-900">
                {toBanglaNumber(product.today)} টাকা
              </p>
            </div>

            <span
              className={`inline-flex items-center gap-0.5 rounded px-2 py-0.5 text-xs font-bold ${
                isUp
                  ? "text-[#EF4444]"
                  : isDown
                    ? "text-[#22C55E]"
                    : "text-gray-400"
              }`}
            >
              <span className="mr-0.5 text-[10px]">
                {isUp ? "▲" : isDown ? "▼" : "—"}
              </span>

              <span>
                {toBanglaNumber(Math.abs(product.change.pct))}%
              </span>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

const ProductSkeleton = () => {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5">
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 animate-pulse rounded-xl bg-gray-200" />

        <div className="flex-1">
          <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />

          <div className="mt-2 h-3 w-20 animate-pulse rounded bg-gray-100" />

          <div className="mt-5 flex items-end justify-between">
            <div>
              <div className="h-3 w-16 animate-pulse rounded bg-gray-100" />

              <div className="mt-2 h-5 w-24 animate-pulse rounded bg-gray-200" />
            </div>

            <div className="h-5 w-12 animate-pulse rounded bg-gray-100" />
          </div>
        </div>
      </div>
    </div>
  );
};

const CategoryProducts = ({ slug }: CategoryProductsProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [sort, setSort] = useState<SortOption>("default");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [categoryNotFound, setCategoryNotFound] = useState(false);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      setLoading(true);
      setError(false);
      setCategoryNotFound(false);
      setCategory(null);
      setProducts([]);

      try {
        const [categoryResponse, productsResponse] = await Promise.all([
          fetch(
            `https://api.abcz.workers.dev/api/bazardor/categories/${encodeURIComponent(slug)}`
          ),
          fetch(
            `https://api.abcz.workers.dev/api/bazardor/products?category=${encodeURIComponent(slug)}`
          ),
        ]);

        if (categoryResponse.status === 404) {
          setCategoryNotFound(true);
          return;
        }

        if (!categoryResponse.ok || !productsResponse.ok) {
          throw new Error("Failed to fetch category or products");
        }

        const categoryData: Category = await categoryResponse.json();
        const productsData: Product[] = await productsResponse.json();

        if (
          !categoryData ||
          !categoryData.slug ||
          !Array.isArray(productsData)
        ) {
          throw new Error("Invalid API response");
        }

        setCategory(categoryData);
        setProducts(productsData);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchCategoryProducts();
    }
  }, [slug]);

  const sortedProducts = useMemo(() => {
    const result = [...products];

    if (sort === "low") {
      result.sort((a, b) => a.today - b.today);
    }

    if (sort === "high") {
      result.sort((a, b) => b.today - a.today);
    }

    return result;
  }, [products, sort]);

  if (loading) {
    return (
      <main className="w-full bg-[#FAFAFA] py-8">
        <div className="mx-auto max-w-[1120px] px-4 lg:px-0">
          <div className="mb-6 bg-white p-5 sm:p-6">
            <div className="h-7 w-28 animate-pulse rounded bg-gray-200" />

            <div className="mt-2 h-4 w-56 animate-pulse rounded bg-gray-100" />
          </div>

          <div className="mb-5 flex items-center justify-between gap-4">
            <div className="h-4 w-36 animate-pulse rounded bg-gray-200" />

            <div className="h-10 w-48 animate-pulse rounded-lg bg-gray-200" />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <ProductSkeleton key={index} />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (categoryNotFound) {
    return (
      <main className="flex min-h-[60vh] w-full items-center justify-center bg-[#FAFAFA] px-4 py-12">
        <div className="text-center">
          <div className="text-5xl">🔎</div>

          <h1 className="mt-4 text-2xl font-bold text-gray-900">
            ক্যাটাগরি পাওয়া যায়নি
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            সঠিক ক্যাটাগরি নির্বাচন করে আবার চেষ্টা করুন।
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

  if (error || !category) {
    return (
      <main className="flex min-h-[60vh] w-full items-center justify-center bg-[#FAFAFA] px-4 py-12">
        <div className="text-center">
          <div className="text-5xl">⚠️</div>

          <h1 className="mt-4 text-2xl font-bold text-gray-900">
            তথ্য লোড করা যায়নি
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।
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

  if (products.length === 0) {
    return (
      <main className="flex min-h-[60vh] w-full items-center justify-center bg-[#FAFAFA] px-4 py-12">
        <div className="text-center">
          <div className="text-5xl">📦</div>

          <h1 className="mt-4 text-2xl font-bold text-gray-900">
            এই ক্যাটাগরিতে কোনো পণ্য নেই
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            অন্য ক্যাটাগরি দেখে নিতে পারেন।
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

  return (
    <main className="w-full bg-[#FAFAFA] py-8">
      <div className="mx-auto max-w-[1120px] px-4 lg:px-0">
        <div className="mb-6 bg-white p-5 sm:p-6">
          <h1 className="flex items-center gap-2 text-2xl font-extrabold text-gray-900">
            <span>{category.icon}</span>
            <span>{category.nameBn}</span>
          </h1>

          <p className="mt-1 text-sm text-gray-400">
            {toBanglaNumber(products.length)}টি পণ্যের আজকের দাম ও পরিবর্তন
          </p>
        </div>

        <div className="mb-5 flex items-center justify-between gap-4">
          <p className="text-sm font-medium text-gray-500">
            মোট {toBanglaNumber(products.length)}টি পণ্য দেখানো হচ্ছে
          </p>

          <label className="flex shrink-0 items-center gap-2 text-sm font-medium text-gray-600">
            <span>সাজান:</span>

            <select
              value={sort}
              onChange={(event) =>
                setSort(event.target.value as SortOption)
              }
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-[#00875A]"
            >
              <option value="default">ডিফল্ট</option>
              <option value="low">দাম: কম থেকে বেশি</option>
              <option value="high">দাম: বেশি থেকে কম</option>
            </select>
          </label>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </main>
  );
};

export default CategoryProducts;
