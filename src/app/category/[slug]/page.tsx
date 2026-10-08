import { notFound } from "next/navigation";
import CategoryProducts from "@/components/CategoryProducts";

export const instant = false;

export default async function CategoryPage({
params,
}: {
params: Promise<{ slug: string }>;
}) {
const { slug } = await params;

const response = await fetch(
`https://api.api-store.workers.dev/api/bazardor/products?category=${encodeURIComponent(slug)}`
);

if (!response.ok) {
notFound();
}

const products = await response.json();

if (!Array.isArray(products) || products.length === 0) {
notFound();
}

return <CategoryProducts slug={slug} />;
}
