import HeroBanner from "../components/hero-banner";
import { ProductsHeader } from "@/modules/products/ui/components/products-header";
import { ProductGrid } from "@/modules/products/ui/components/product-grid";
import { CTA } from "@/modules/products/ui/components/CTA";
import { Product } from "@/payload-types";

interface HomeViewProps {
  products?: Product[];
}

export const HomeView = ({ products = [] }: HomeViewProps) => {
  return (
    <>
      <HeroBanner />
      <div>
        <ProductsHeader />
        <ProductGrid products={products} />
      </div>
      <CTA />
    </>
  );
};
