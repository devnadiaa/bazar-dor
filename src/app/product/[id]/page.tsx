import { Suspense } from "react";
import ProductDetails from "@/components/ProductDetails";

export const instant = false;

export default async function ProductPage({
params,
}: {
params: Promise<{ id: string }>;
}) {
const { id } = await params;

return ( <Suspense fallback={null}> <ProductDetails id={id} /> </Suspense>
);
}
