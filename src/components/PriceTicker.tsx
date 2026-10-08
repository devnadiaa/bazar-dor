"use client";

import MarqueeText from "react-marquee-text";
import "react-marquee-text/dist/styles.css";
import { useEffect, useState } from "react";

interface Product {
  id: number;
  nameBn: string;
  today: number;
  unit: string;
  image: string;
  change: {
    dir: "up" | "down" | "flat";
    pct: number;
  };
}

const PriceTicker = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch(
        "https://api.abcz.workers.dev/api/bazardor/products"
      );

      const data = await res.json();

      setProducts(data);
    };

    fetchProducts();
  }, []);

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="w-full border-b bg-gray-100 text-gray-800">
      <div className="mx-auto flex h-[37px] max-w-7xl">
        <div className="w-full overflow-hidden">
          <MarqueeText
            className="h-full"
            direction="right"
            duration={24}
          >
            <div className="flex h-[37px] items-center whitespace-nowrap">
              {products.map((product) => (
                <span key={product.id} className="flex items-center">
                  <span>
                    {product.image} {product.nameBn} — {product.today} টাকা/
                    {product.unit}
                  </span>

                  <span
                    className={
                      product.change.dir === "up"
                        ? "mx-5 text-green-600"
                        : product.change.dir === "down"
                          ? "mx-5 text-red-600"
                          : "mx-5 text-gray-500"
                    }
                  >
                    {product.change.dir === "up"
                      ? "▲"
                      : product.change.dir === "down"
                        ? "▼"
                        : "—"}{" "}
                    {Math.abs(product.change.pct)}%
                  </span>

                  <span className="mr-5 text-gray-400">•</span>
                </span>
              ))}
            </div>
          </MarqueeText>
        </div>
      </div>
    </div>
  );
};

export default PriceTicker;
