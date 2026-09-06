"use server";

import configPromise from "@payload-config";
import { getPayload } from "payload";
import { Product } from "@/payload-types";
import { getCurrentUser } from "@/modules/auth/actions";

export interface GetProductsParams {
  query?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sort?: string;
  page?: number;
  limit?: number;
}

export async function getFilteredProductsAction(params: GetProductsParams) {
  const {
    query,
    category,
    minPrice,
    maxPrice,
    inStock,
    sort = "-createdAt",
    page = 1,
    limit = 9,
  } = params;

  const payload = await getPayload({ config: configPromise });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {};

  if (query) {
    where.or = [
      { name: { contains: query } },
      { description: { contains: query } },
    ];
  }

  if (category && category !== "all") {
    where.category = { equals: category };
  }

  if (
    (minPrice !== undefined && minPrice > 0) ||
    (maxPrice !== undefined && maxPrice < 10000)
  ) {
    const priceFilter: Record<string, number> = {};
    if (minPrice !== undefined && minPrice > 0)
      priceFilter.greater_than_equal = minPrice;
    if (maxPrice !== undefined && maxPrice < 10000)
      priceFilter.less_than_equal = maxPrice;
    where.price = priceFilter;
  }

  if (inStock) {
    where.stock = { greater_than: 0 };
  }

  try {
    const result = await payload.find({
      collection: "products",
      where,
      sort,
      page,
      limit,
      depth: 1,
    });

    return {
      products: result.docs as Product[],
      totalDocs: result.totalDocs,
      totalPages: result.totalPages,
      page: result.page,
      hasNextPage: result.hasNextPage,
      hasPrevPage: result.hasPrevPage,
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    return {
      products: [],
      totalDocs: 0,
      totalPages: 0,
      page: 1,
      hasNextPage: false,
      hasPrevPage: false,
    };
  }
}

export async function getCategoriesAction() {
  const payload = await getPayload({ config: configPromise });
  try {
    const categories = await payload.find({
      collection: "categories",
      limit: 100,
    });
    return categories.docs;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export async function createQuoteAction(data: {
  userId?: string | number;
  productId: string | number;
  note?: string;
  quantity?: number;
}) {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "You must be signed in to submit a quote request" };
  }

  const payload = await getPayload({ config: configPromise });
  try {
    const quote = await payload.create({
      collection: "quotes",
      data: {
        user: user.id,
        items: [
          {
            product: Number(data.productId),
            quantity: data.quantity || 1,
          },
        ],
        note: data.note,
        status: "pending",
      },
    });
    return { success: true, quote };
  } catch (error) {
    console.error("Error creating quote:", error);
    return { error: "Failed to create quote request" };
  }
}

export async function createBulkQuoteAction(data: {
  userId?: string | number;
  items: { productId: string | number; quantity: number }[];
  note?: string;
}) {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "You must be signed in to submit a bulk quote request" };
  }

  const payload = await getPayload({ config: configPromise });
  try {
    const quote = await payload.create({
      collection: "quotes",
      data: {
        user: user.id,
        items: data.items.map((item) => ({
          product: Number(item.productId),
          quantity: item.quantity,
        })),
        note: data.note,
        status: "pending",
      },
    });
    return { success: true, quote };
  } catch (error) {
    console.error("Error creating bulk quote:", error);
    return { error: "Failed to submit bulk quote request" };
  }
}
