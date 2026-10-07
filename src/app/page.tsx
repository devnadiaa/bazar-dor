import Hero from "@/components/Hero";
import ProductSections from "@/components/ProductSections";

export const instant = false;

export default function Home() {
  return (
    <>
      <Hero />
      <ProductSections />
    </>
  );
}
