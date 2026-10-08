import Link from "next/link";

interface Product {
id: number;
slug: string;
nameBn: string;
unit: string;
image: string;
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

const toBanglaNumber = (value: number): string => {
const englishDigits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const bengaliDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

const formattedNum = value.toLocaleString("bn-BD", {
minimumFractionDigits: 0,
maximumFractionDigits: 1,
});

return formattedNum
.split("")
.map((char) => {
const index = englishDigits.indexOf(char);
return index !== -1 ? bengaliDigits[index] : char;
})
.join("");
};

const ProductCard = ({ product }: { product: Product }) => {
const isUp = product.change.dir === "up";
const isDown = product.change.dir === "down";

return (
<Link
href={`/product/${product.id}`}
className="block rounded-xl border border-gray-100 bg-white p-4 transition-all hover:border-gray-200 hover:shadow-sm"
> <div className="flex items-start gap-3"> <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F9FAFB] text-xl">
{product.image} </div>


    <div className="min-w-0">
      <h3 className="truncate text-base font-bold leading-snug text-gray-900">
        {product.nameBn}
      </h3>

      <p className="mt-0.5 text-xs text-gray-400">
        {unitLabels[product.unit] || `প্রতি ${product.unit}`}
      </p>
    </div>
  </div>

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
          ? "bg-[#FDF2F2] text-[#EF4444]"
          : isDown
            ? "bg-[#F0FDF4] text-[#22C55E]"
            : "bg-gray-100 text-gray-500"
      }`}
    >
      <span className="mr-0.5 text-[10px]">
        {isUp ? "▲" : isDown ? "▼" : "—"}
      </span>

      <span>{toBanglaNumber(Math.abs(product.change.pct))}%</span>
    </span>
  </div>
</Link>


);
};

const ProductGrid = ({ products }: { products: Product[] }) => {
return ( <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
{products.map((product) => ( <ProductCard key={product.id} product={product} />
))} </div>
);
};

const ProductSections = async () => {
const res = await fetch(
"https://api.api-store.workers.dev/api/bazardor/products"
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

return ( <main className="w-full bg-[#FAFAFA] py-8"> <div className="mx-auto max-w-[1120px] space-y-10 px-4 lg:px-0"> <section> <div className="mb-4"> <h2 className="flex items-center gap-1.5 text-xl font-bold text-gray-900"> <span className="text-[#EF4444]">▲</span>
আজ দাম বেড়েছে </h2> </div>


      <ProductGrid products={risers} />
    </section>

    <section>
      <div className="mb-4">
        <h2 className="flex items-center gap-1.5 text-xl font-bold text-gray-900">
          <span className="text-[#22C55E]">▼</span>
          আজ দাম কমেছে
        </h2>
      </div>

      <ProductGrid products={fallers} />
    </section>

    <section id="সব-পণ্য" className="scroll-mt-10">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-gray-900">
          সব পণ্য
        </h2>

        <p className="mt-1 text-xs text-gray-400">
          বাজারের সব প্রয়োজনীয় পণ্যের আজকের দাম এক নজরে দেখুন
        </p>
      </div>

      <ProductGrid products={products} />
    </section>
  </div>
</main>


);
};

export default ProductSections;
