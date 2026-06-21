import { getPayload } from "payload";
import configPromise from "@payload-config";
import { notFound } from "next/navigation";
import { ProductDetailView } from "@/modules/products/ui/views/product-detail-view";
import { Product } from "@/payload-types";
import { getCurrentUser } from "@/modules/auth/actions";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const payload = await getPayload({ config: configPromise });
  const user = await getCurrentUser();

  const { docs: products } = await payload.find({
    collection: "products",
    where: {
      or: [
        {
          slug: {
            equals: slug,
          },
        },
        {
          id: {
            equals: slug,
          },
        },
      ],
    },
    depth: 1,
  });

  if (!products || products.length === 0) {
    return notFound();
  }

  const product = products[0] as Product;

  return (
    <ProductDetailView
      initialProduct={product}
      serverURL={process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000"}
      userRole={user?.role}
    />
  );
}
