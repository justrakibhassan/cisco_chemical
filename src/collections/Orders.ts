import { CollectionConfig } from "payload";
import type { User } from "../payload-types";

export const Orders: CollectionConfig = {
  slug: "orders",
  admin: {
    useAsTitle: "id",
    defaultColumns: ["id", "status", "total", "createdAt"],
  },
  access: {
    read: ({ req: { user } }: { req: { user: User | null } }) => {
      if (!user) return false;
      if (user.role === "admin" || user.role === "sales_manager") return true;
      return {
        user: {
          equals: user.id,
        },
      };
    },
    create: () => true,
  },
  fields: [
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      required: true,
      index: true,
    },
    {
      name: "status",
      type: "select",
      defaultValue: "pending",
      options: [
        { label: "Pending", value: "pending" },
        { label: "Processing", value: "processing" },
        { label: "Shipped", value: "shipped" },
        { label: "Delivered", value: "delivered" },
        { label: "Cancelled", value: "cancelled" },
      ],
    },
    {
      name: "total",
      type: "number",
      required: true,
    },
    {
      name: "items",
      type: "array",
      fields: [
        {
          name: "product",
          type: "relationship",
          relationTo: "products",
          required: true,
        },
        {
          name: "quantity",
          type: "number",
          required: true,
        },
        {
          name: "price",
          type: "number",
          required: true,
        },
        {
          name: "isSample",
          type: "checkbox",
          defaultValue: false,
        },
      ],
    },
  ],
};
