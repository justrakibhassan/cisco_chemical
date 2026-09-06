import { CollectionConfig, FieldHook } from "payload";
import type { User } from "../payload-types";

const appURL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// টাইপ সেফটির জন্য হুকটি আলাদা ফাংশন হিসেবে লিখলাম
const formatSlug: FieldHook = ({ value, data }) => {
  if (!value && data?.name) {
    return data.name
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "")
      .toLowerCase();
  }
  return value;
};

export const Products: CollectionConfig = {
  slug: "products",
  admin: {
    useAsTitle: "name",
    // 👇 প্রোডাক্ট লিস্টে এই কলামগুলো দেখাবে
    defaultColumns: ["name", "price", "stock", "category", "updatedAt"],
    livePreview: {
      url: ({ data }) => {
        // 👇 ফিক্স: নতুন প্রোডাক্ট হলে 'new-preview' স্লাগ ব্যবহার করবে
        const slug = data?.slug || "new-preview";
        return `${appURL}/products/${slug}`;
      },
    },
  },
  access: {
    read: () => true,
    create: ({ req: { user } }: { req: { user: User | null } }) =>
      user?.role === "admin" || user?.role === "sales_manager",
    update: ({ req: { user } }: { req: { user: User | null } }) =>
      user?.role === "admin" || user?.role === "sales_manager",
    delete: ({ req: { user } }: { req: { user: User | null } }) =>
      user?.role === "admin",
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      label: "Product Name",
    },
    {
      type: "row", // লেআউট সুন্দর করার জন্য পাশাপাশি রাখা হলো
      fields: [
        {
          name: "category",
          type: "relationship",
          relationTo: "categories",
          required: true,
          admin: { width: "50%" },
        },
        {
          name: "stock",
          label: "Stock Quantity",
          type: "number",
          required: true,
          defaultValue: 0,
          index: true,
          min: 0, // 👈 মাইনাস ভ্যালু দেওয়া যাবে না
          admin: { width: "50%" },
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "price",
          type: "number",
          required: true,
          index: true,
          label: "Selling Price (বর্তমান দাম)",
          min: 0,
          admin: { width: "50%" },
        },
        {
          name: "oldPrice",
          type: "number",
          label: "Old Price (আগের দাম)",
          min: 0,
          admin: {
            width: "50%",
            description: "যে দামটি কাটা অবস্থায় থাকবে।",
          },
        },
      ],
    },
    {
      name: "mainImage",
      type: "upload",
      relationTo: "media",
      required: true,
      label: "Main Product Image",
    },
    {
      name: "gallery",
      type: "array",
      label: "Product Gallery",
      minRows: 0, // গ্যালারি অপশনাল রাখা ভালো
      maxRows: 6,
      labels: {
        singular: "Image",
        plural: "Images",
      },
      fields: [
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          required: true,
        },
      ],
    },
    {
      name: "description",
      type: "richText",
      label: "Description",
      admin: { disableListColumn: true },
      hooks: {
        afterRead: [
          ({ value }) => {
            if (typeof value === "string") {
              return {
                root: {
                  type: "root",
                  children: [
                    {
                      type: "paragraph",
                      children: [
                        {
                          type: "text",
                          text: value,
                          version: 1,
                        },
                      ],
                      version: 1,
                    },
                  ],
                  version: 1,
                },
              };
            }
            return value;
          },
        ],
      },
    },
    {
      name: "slug",
      type: "text",
      unique: true, // 👈 স্লাগ ইউনিক হতে হবে
      admin: {
        position: "sidebar",
        description: "Auto-generated from name, but can be edited.",
      },
      hooks: {
        beforeValidate: [formatSlug], // টাইপ সেফ হুক
      },
    },
  ],
};
