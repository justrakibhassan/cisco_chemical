import type { CollectionConfig } from "payload";
import type { User } from "../payload-types";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const Quotes: CollectionConfig = {
  slug: "quotes",
  admin: {
    useAsTitle: "id",
    defaultColumns: ["id", "user", "status", "quotedPrice", "createdAt"],
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
    create: ({ req: { user } }: { req: { user: User | null } }) => !!user,
    update: ({ req: { user } }: { req: { user: User | null } }) => {
      if (!user) return false;
      return user.role === "admin" || user.role === "sales_manager";
    },
    delete: ({ req: { user } }: { req: { user: User | null } }) => {
      if (!user) return false;
      return user.role === "admin";
    },
  },
  hooks: {
    afterChange: [
      async ({ doc, previousDoc, req }) => {
        if (doc.status === "quoted" && previousDoc.status === "pending") {
          try {
            const user = await req.payload.findByID({
              collection: "users",
              id: typeof doc.user === "object" ? doc.user.id : doc.user,
            });

            if (user && user.email) {
              await resend.emails.send({
                from: "Cisco Chemical <onboarding@resend.dev>",
                to: user.email,
                subject: "Your Chemical Quote is Ready - Cisco Chemical Inc.",
                html: `
                  <div style="font-family: sans-serif; padding: 20px; color: #333;">
                    <h2 style="color: #10b981;">Quote Approved!</h2>
                    <p>Hello ${user.name || "Customer"},</p>
                    <p>Good news! Your quote request <b>#${doc.id}</b> has been reviewed and approved by our sales team.</p>
                    <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
                      <p style="margin: 0;"><b>Approved Price:</b> $${doc.quotedPrice}</p>
                      <p style="margin: 5px 0 0 0;"><b>Status:</b> Ready for Payment</p>
                    </div>
                    <p>Please log in to your dashboard to complete the payment and initialize shipping.</p>
                    <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="display: inline-block; background: #10b981; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; margin-top: 10px;">View Dashboard & Pay</a>
                    <p style="margin-top: 30px; font-size: 12px; color: #666;">If you have any questions, please reply to this email.</p>
                  </div>
                `,
              });
              console.log(`Email sent to ${user.email} for Quote #${doc.id}`);
            }
          } catch (error) {
            console.error("Failed to send quote approval email:", error);
          }
        }
      },
    ],
  },
  fields: [
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      required: true,
      index: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: "items",
      type: "array",
      required: true,
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
          min: 1,
          required: true,
        },
      ],
    },
    {
      name: "note",
      type: "textarea",
      label: "Customer Note",
    },
    {
      name: "status",
      type: "select",
      defaultValue: "pending",
      required: true,
      index: true,
      options: [
        { label: "Pending Review", value: "pending" },
        { label: "Quoted", value: "quoted" },
        { label: "Paid", value: "paid" },
        { label: "Cancelled", value: "cancelled" },
      ],
      access: {
        update: ({ req: { user } }: { req: { user: User | null } }) =>
          user?.role === "admin" || user?.role === "sales_manager",
      },
    },
    {
      name: "quotedPrice",
      type: "number",
      label: "Approved Price ($)",
      admin: {
        description: "Set by admin to approve the quote",
        position: "sidebar",
        condition: (data) => data?.status !== "pending",
      },
      access: {
        update: ({ req: { user } }: { req: { user: User | null } }) =>
          user?.role === "admin" || user?.role === "sales_manager",
      },
    },
  ],
};
