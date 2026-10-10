import Link from "next/link";

interface Product {
  id: number;
  slug: string;
  nameBn: string;
  categoryIcon: string;
  unit: string;
  today: number;
  change: {
    dir: "up" | "down" | "flat";
    pct: number;
  };
}

const unitLabels: Record<string, string> = {
  kg: "প্রতি কেজি",
  litre: "প্রতি লিটার",
  dozen: "প্রতি ডজন",
  piece: "প্রতি পিস",
};

function getProductIcon(nameBn: string, categoryIcon: string) {
  if (nameBn.includes("চাল")) return "🍚";

  if (nameBn.includes("ডাল") || nameBn.includes("ছোলা")) {
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
  if (nameBn.includes("ঢেঁড়স")) return "🟢";

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

const toBanglaNumber = (value: number) =>
  value.toLocaleString("bn-BD", {
    maximumFractionDigits: 1,
  });

function ProductCard({ product }: { product: Product }) {
  const isUp = product.change.dir === "up";
  const isDown = product.change.dir === "down";

  return (
    <Link
      href={`/product/${product.id}`}
      className="flex items-center justify-between gap-3 rounded-xl border border-[#F1F2F4] bg-white p-4 transition-shadow hover:shadow-[0_2px_8px_rgba(0,0,0,0.03)]"
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FAFAFA] text-2xl">
          {getProductIcon(product.nameBn, product.categoryIcon)}
        </div>

        <div className="min-w-0">
          <h3 className="mb-1 truncate text-[15px] font-bold leading-tight text-[#111111]">
            {product.nameBn}
          </h3>

          <p className="text-[12px] text-[#777777]">
            {unitLabels[product.unit] || `প্রতি ${product.unit}`}
          </p>
        </div>
      </div>

      <div className="shrink-0 text-right">
        <p className="mb-1 text-[16px] font-extrabold leading-tight text-[#111111]">
          {toBanglaNumber(product.today)} টাকা
        </p>

        <span
          className={`inline-flex items-center text-[12px] font-semibold ${
            isUp
              ? "text-[#EF4444]"
              : isDown
                ? "text-[#22C55E]"
                : "text-[#9CA3AF]"
          }`}
        >
          <span className="mr-1 text-[9px]">
            {isUp ? "▲" : isDown ? "▼" : "—"}
          </span>

          {toBanglaNumber(Math.abs(product.change.pct))}%
        </span>
      </div>
    </Link>
  );
}

function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <p className="rounded-xl border border-[#F1F2F4] bg-white p-5 text-center text-sm text-[#777777]">
        এই মুহূর্তে কোনো পণ্যের তথ্য পাওয়া যায়নি।
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default async function ProductSections() {
  const res = await fetch(
    "https://openapi.programming-hero.com/api/bazardor/products"
  );

  if (!res.ok) {
    throw new Error("পণ্যের তথ্য পাওয়া যায়নি");
  }

  const products: Product[] = await res.json();

  const risers = products
    .filter((product) => product.change.dir === "up")
    .sort((a, b) => b.change.pct - a.change.pct)
    .slice(0, 6);

  const fallers = products
    .filter((product) => product.change.dir === "down")
    .sort(
      (a, b) => Math.abs(b.change.pct) - Math.abs(a.change.pct)
    )
    .slice(0, 6);

  return (
    <main className="w-full bg-[#FAFAFA] pb-16">
      <div className="mx-auto max-w-[1120px] space-y-10 px-4 lg:px-0">
        <section>
          <div className="mb-4 flex items-center gap-2">
            <span className="text-xs text-[#EF4444]">▲</span>

            <h2 className="text-[17px] font-bold text-[#111111]">
              আজ দাম বেড়েছে
            </h2>
          </div>

          <ProductGrid products={risers} />
        </section>

        <section>
          <div className="mb-4 flex items-center gap-2">
            <span className="text-xs text-[#22C55E]">▼</span>

            <h2 className="text-[17px] font-bold text-[#111111]">
              আজ দাম কমেছে
            </h2>
          </div>

          <ProductGrid products={fallers} />
        </section>

        <section id="সব-পণ্য" className="scroll-mt-10">
          <div className="mb-5">
            <h2 className="mb-0.5 text-[18px] font-bold text-[#111111]">
              সব পণ্য
            </h2>

            <p className="text-[12px] text-[#777777]">
              বাজারের সব প্রয়োজনীয় পণ্যের আজকের দাম এক নজরে দেখুন
            </p>
          </div>

          <ProductGrid products={products} />
        </section>
      </div>
    </main>
  );
}
