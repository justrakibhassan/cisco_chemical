import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import path from "path";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";
import sharp from "sharp";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Products } from "./collections/Products";
import { Categories } from "./collections/Categories";
import { Orders } from "./collections/Orders";
import { Quotes } from "./collections/Quotes";
import { SiteSettings } from "./globals/SiteSettings";
import { HomePage } from "./globals/HomePage";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const appURL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      graphics: {
        Logo: "./components/payload/Logo",
        Icon: "./components/payload/Icon",
      },
      views: {
        dashboard: {
          Component: "./components/payload/Dashboard",
        },
      },
    },
    meta: {
      titleSuffix: "- Cisco Chemical",
      icons: [
        {
          rel: "icon",
          type: "image/x-icon",
          url: "/favicon.ico",
        },
      ],
    },
    livePreview: {
      url: ({ data }) => `${appURL}/products/${data.slug}`,
    },
  },
  collections: [Users, Media, Categories, Products, Orders, Quotes],
  globals: [SiteSettings, HomePage],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || "",
    },
  }),
  sharp,
  plugins: [
    vercelBlobStorage({
      collections: {
        media: true,
      },
      // Token provided by Vercel once Blob storage is added to your Vercel project
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
  ],
});
