import { Suspense } from "react";
import { notFound } from "next/navigation";
import ProductDetails from "@/components/ProductDetails";

export const instant = false;

export default async function ProductPage({
params,
}: {
params: Promise<{ id: string }>;
}) {
const { id } = await params;

const response = await fetch(
`https://api.api-store.workers.dev/api/bazardor/products/${encodeURIComponent(id)}`
);

if (!response.ok) {
notFound();
}

const product = await response.json();

if (!product || !product.id) {
notFound();
}

return ( <Suspense fallback={null}> <ProductDetails id={id} /> </Suspense>
);
}
