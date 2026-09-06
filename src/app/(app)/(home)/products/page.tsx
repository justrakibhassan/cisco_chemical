import { Metadata } from "next";
import { Suspense } from "react";
import { ProductsView } from "@/modules/products/ui/views/product-view";
import {
  getFilteredProductsAction,
  getCategoriesAction,
} from "@/modules/products/actions";

export const metadata: Metadata = {
  title: "Products Catalog | Cisco Chemical",
  description:
    "Explore Cisco Chemical's comprehensive catalog of industrial, laboratory, and specialty chemical products with live stock availability and custom quote options.",
};

interface ProductsPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    min?: string;
    max?: string;
    stock?: string;
    sort?: string;
    page?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams.q || undefined;
  const category = resolvedSearchParams.category || "all";
  const minPrice = resolvedSearchParams.min
    ? parseInt(resolvedSearchParams.min, 10)
    : 0;
  const maxPrice = resolvedSearchParams.max
    ? parseInt(resolvedSearchParams.max, 10)
    : 10000;
  const inStock = resolvedSearchParams.stock === "true";
  const sort = resolvedSearchParams.sort || "-createdAt";
  const page = resolvedSearchParams.page
    ? parseInt(resolvedSearchParams.page, 10)
    : 1;

  const [productsData, categories] = await Promise.all([
    getFilteredProductsAction({
      query,
      category,
      minPrice,
      maxPrice,
      inStock,
      sort,
      page,
      limit: 12,
    }),
    getCategoriesAction(),
  ]);

  return (
    <div className="pt-20">
      <Suspense
        fallback={<div className="min-h-screen animate-pulse bg-slate-50" />}
      >
        <ProductsView
          initialProducts={productsData.products}
          initialTotalDocs={productsData.totalDocs}
          initialTotalPages={productsData.totalPages}
          initialCategories={categories}
        />
      </Suspense>
    </div>
  );
}
