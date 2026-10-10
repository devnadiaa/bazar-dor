"use client";

import MarqueeText from "react-marquee-text";
import "react-marquee-text/dist/styles.css";
import { useEffect, useState } from "react";

interface Product {
  id: number;
  nameBn: string;
  categoryIcon: string;
  today: number;
  unit: string;
  change: {
    dir: "up" | "down" | "flat";
    pct: number;
  };
}

const unitLabels: Record<string, string> = {
  kg: "কেজি",
  litre: "লিটার",
  dozen: "ডজন",
  piece: "পিস",
};

const toBanglaNumber = (value: number) =>
  value.toLocaleString("bn-BD", {
    maximumFractionDigits: 1,
  });

export default function PriceTicker() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          "https://openapi.programming-hero.com/api/bazardor/products"
        );

        if (!res.ok) {
          return;
        }

        const data: Product[] = await res.json();

        if (Array.isArray(data)) {
          setProducts(data);
        }
      } catch {
        setProducts([]);
      }
    };

    fetchProducts();
  }, []);

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="w-full border-y border-[#E5E7EB] bg-white py-2 text-[#333333]">
      <div className="mx-auto flex min-h-[45px] max-w-7xl">
        <div className="w-full overflow-hidden">
          <MarqueeText className="h-full" direction="right" duration={24}>
            <div className="flex min-h-[45px] items-center whitespace-nowrap">
              {products.map((product) => {
                const isUp = product.change.dir === "up";
                const isDown = product.change.dir === "down";

                return (
                  <span
                    key={product.id}
                    className="mx-1 inline-flex min-h-[32px] items-center rounded-md border border-[#E5E7EB] bg-white px-3 py-1"
                  >
                    <span>
                      {product.categoryIcon} {product.nameBn}
                      <span className="mx-1 text-[#9CA3AF]">|</span>
                      {toBanglaNumber(product.today)} টাকা/
                      {unitLabels[product.unit] || product.unit}
                    </span>

                    <span
                      className={`ml-3 ${
                        isUp
                          ? "text-[#EF4444]"
                          : isDown
                            ? "text-[#22C55E]"
                            : "text-[#9CA3AF]"
                      }`}
                    >
                      {isUp ? "▲" : isDown ? "▼" : "—"}{" "}
                      {toBanglaNumber(Math.abs(product.change.pct))}%
                    </span>
                  </span>
                );
              })}
            </div>
          </MarqueeText>
        </div>
      </div>
    </div>
  );
}

