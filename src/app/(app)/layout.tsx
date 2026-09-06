import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cisco Chemical Inc - Industrial Chemical Manufacturing & Distribution",
  description:
    "Enterprise B2B chemical manufacturing, specialty polymers, battery materials, pigments, and bulk distribution platform.",
};

import { CurrencyProvider } from "@/providers/currency-provider";
import { CartProvider } from "@/providers/cart-provider";
import { AssistantChat } from "@/components/assistant-chat";
import { ChatErrorBoundary } from "@/components/chat-error-boundary";
import { Suspense } from "react";
import { Footer } from "@/modules/home/ui/components/footer";
import { Navbar } from "@/modules/home/ui/components/navbar";
import { BottomNav } from "@/modules/home/ui/components/bottom-nav";
import { getCurrentUser } from "@/modules/auth/actions";
import { User as UserType } from "@/payload-types";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <NuqsAdapter>
            <CurrencyProvider>
              <CartProvider initialUser={user as UserType}>
                <Suspense fallback={<div className="h-20" />}>
                  <Navbar user={user as UserType} />
                </Suspense>
                <div className="flex flex-col min-h-screen">
                  <main className="flex-1">{children}</main>
                </div>
                <BottomNav user={user as UserType} />
                <Footer />
                <ChatErrorBoundary>
                  <AssistantChat />
                </ChatErrorBoundary>
              </CartProvider>
            </CurrencyProvider>
          </NuqsAdapter>
          <Toaster position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
