"use client";

import { Product } from "@/payload-types";
import { ProductCard } from "./product-card";
import { useCart } from "@/hooks/use-cart";

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  const { addToCart } = useCart();

  return (
    <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-12 py-12">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={() =>
              addToCart({
                id: String(product.id),
                name: product.name,
                price: product.price,
                image:
                  typeof product.mainImage === "object" &&
                  product.mainImage !== null
                    ? (product.mainImage as { url?: string }).url || ""
                    : "",
                slug: product.slug || "",
              })
            }
          />
        ))}
      </div>
    </div>
  );
}
