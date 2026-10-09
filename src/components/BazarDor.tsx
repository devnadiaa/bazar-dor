"use client";

import { useEffect, useState } from "react";

interface Product {
  id: number;
  nameBn: string;
  categoryIcon: string;
  categoryNameBn: string;
  today: number;
  yesterday: number;
  unit: string;
  change: {
    dir: "up" | "down" | "flat";
    pct: number;
  };
}

const BazarDor = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "https://api.abcz.workers.dev/api/bazardor/products"
        );

        if (!response.ok) {
          throw new Error("ডাটা লোড করতে ব্যর্থ হয়েছে");
        }

        const data: Product[] = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "ডাটা লোড করতে ব্যর্থ হয়েছে");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-[1120px] px-4 py-10">
        <div className="mb-6 h-8 w-48 animate-pulse rounded bg-gray-200" />
        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white">
          <div className="h-12 animate-pulse bg-gray-100" />
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-16 animate-pulse border-t border-gray-100"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-10 text-center text-sm text-red-500">
        {error}
      </div>
    );
  }

  return (
    <section className="bg-[#FAFAFA] py-10">
      <div className="mx-auto max-w-[1120px] px-4 lg:px-0">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            আজকের বাজার দর
          </h2>
          <p className="mt-1 text-sm text-gray-400">
            প্রয়োজনীয় পণ্যের আজকের দাম এক নজরে দেখুন
          </p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white">
          <table className="w-full min-w-[700px] border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-5 py-4 text-left text-sm font-semibold text-gray-700">
                  পণ্য ও প্রকার
                </th>
                <th className="px-5 py-4 text-left text-sm font-semibold text-gray-700">
                  আজকের দাম
                </th>
                <th className="px-5 py-4 text-left text-sm font-semibold text-gray-700">
                  গতকালের দাম
                </th>
                <th className="px-5 py-4 text-left text-sm font-semibold text-gray-700">
                  পরিবর্তন
                </th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => {
                const isUp = product.change.dir === "up";
                const isDown = product.change.dir === "down";

                return (
                  <tr
                    key={product.id}
                    className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">
                          {product.categoryIcon}
                        </span>

                        <div>
                          <p className="font-semibold text-gray-900">
                            {product.nameBn}
                          </p>
                          <p className="mt-0.5 text-xs text-gray-400">
                            {product.categoryNameBn}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm font-semibold text-gray-900">
                      {product.today} ৳ / {product.unit}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-500">
                      {product.yesterday} ৳
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-bold ${
                          isUp
                            ? "bg-red-50 text-red-500"
                            : isDown
                              ? "bg-green-50 text-green-500"
                              : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {isUp ? "▲" : isDown ? "▼" : "●"}{" "}
                        {Math.abs(product.change.pct)}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default BazarDor;