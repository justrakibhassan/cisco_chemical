"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, User, Search, X, ChevronRight, LayoutDashboard } from "lucide-react";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription 
} from "@/components/ui/sheet";
import { useEffect, useState } from "react";
import { useQueryState } from "nuqs";
import { useRouter } from "next/navigation";
import { UserNav } from "@/modules/auth/ui/components/user-nav";
import { signOutAction } from "@/modules/auth/actions";
import { toast } from "sonner";
import { User as UserType } from "@/payload-types";
import { useCart } from "@/hooks/use-cart";
import { ShoppingCart } from "lucide-react";
import { CartSidebar } from "./cart-sidebar";
import { CurrencyToggle } from "@/components/currency-toggle";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/products", label: "Products" },
  { href: "/quick-order", label: "Quick Order" },
  { href: "/contact", label: "Contact" },
  { href: "/careers", label: "Careers" },
];

interface NavbarProps {
  user?: UserType | null;
}

export const Navbar = ({ user: initialUser }: NavbarProps) => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [search] = useQueryState("q", { defaultValue: "" });
  const [inputValue, setInputValue] = useState(search);
  const [user, setUser] = useState<UserType | null>(initialUser || null);
  const { count } = useCart();
  const router = useRouter();

  useEffect(() => {
    if (initialUser) {
      setUser(initialUser);
    }
  }, [initialUser]);

  useEffect(() => {
    setInputValue(search);
  }, [search]);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close search on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsSearchOpen(false);
      }
    };

    if (isSearchOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isSearchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      router.push(`/products?q=${encodeURIComponent(inputValue.trim())}`);
      setIsSearchOpen(false);
    }
  };

  return (
    <header
      className={`w-full border-b border-gray-200 bg-white/95 backdrop-blur-md fixed top-0 left-0 z-50 transition-all duration-300 ${
        scrolled ? "shadow-lg bg-white/98" : ""
      }`}
    >
      {/* Main Navbar */}
      <div className="max-w-[1720px] mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-12 py-3 lg:py-4">
        {/* Logo - Left */}
        <Link
          href="/"
          className="flex items-center space-x-2 text-xl sm:text-2xl font-bold text-black group flex-shrink-0 lg:ml-10"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 relative">
            <Image
              src="/images/logo.png"
              alt="Logo"
              fill
              className="object-contain transition-transform duration-300 group-hover:rotate-12"
              priority
            />
          </div>
          <span className="transition-colors duration-300 group-hover:text-green-600">
            Cisco Chem
          </span>
        </Link>

        {/* Desktop Nav - Center */}
        <nav className="hidden lg:flex gap-8 flex-1 justify-center mx-4">
          {navLinks.map(({ href, label }, idx) => (
            <Link
              key={href}
              href={href}
              className="relative text-sm font-medium text-gray-600 hover:text-green-600 transition-all duration-300 py-2
                after:content-[''] after:block after:h-[2px] after:bg-green-600 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left after:mt-1"
              style={{ transitionDelay: `${idx * 50}ms` }}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right side - Search + ThemeToggle + Login + Mobile Menu */}
        <div className="flex items-center gap-3 flex-shrink-0 lg:mr-10">
          {/* Search Button - Desktop */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-600 hover:text-green-600 hover:border-green-300 transition-all duration-300 hover:shadow-md"
          >
            <Search className="w-4 h-4" />
            <span className="text-sm hidden lg:inline">Search</span>
          </button>

          {/* Cart Button - Desktop */}
          <CartSidebar>
            <button
              className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-600 hover:text-green-600 hover:border-green-300 transition-all duration-300 hover:shadow-md relative"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="text-sm hidden lg:inline">Cart</span>
              {count > 0 && (
                <span className="absolute -top-2 -right-2 bg-green-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                  {count}
                </span>
              )}
            </button>
          </CartSidebar>

          {/* Currency Toggle - Desktop */}
          <div className="hidden lg:block mr-2">
            <CurrencyToggle />
          </div>

          {/* User Navigation (Login/Profile) */}
          <div className="hidden sm:block">
            <UserNav user={user} />
          </div>

          {/* Mobile Menu */}
          <div className="flex items-center gap-2 sm:hidden">
            {/* Search Button - Mobile */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
            <Search className="h-5 w-5 text-gray-700" />
            </button>
            
            {/* Cart Button - Mobile */}
            <CartSidebar>
              <button
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 relative"
              >
                <ShoppingCart className="h-5 w-5 text-gray-700" />
                {count > 0 && (
                  <span className="absolute top-0 right-0 bg-green-600 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                    {count}
                  </span>
                )}
              </button>
            </CartSidebar>

            {/* Mobile Menu Trigger */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <button className="p-2 rounded-lg hover:bg-zinc-100 transition-colors duration-200">
                  <Menu className="h-5 w-5 text-zinc-700" />
                </button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-full sm:w-80 p-0 flex flex-col bg-white border-l border-zinc-200"
              >
                <div className="sr-only">
                  <SheetHeader>
                    <SheetTitle>Navigation Menu</SheetTitle>
                    <SheetDescription>Access site links and account settings.</SheetDescription>
                  </SheetHeader>
                </div>

                {/* Mobile Header - Visual */}
                <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
                  <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center gap-3">
                    <div className="w-8 h-8 relative">
                      <Image
                        src="/images/logo.png"
                        alt="Logo"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <span className="text-lg font-bold text-zinc-900 tracking-tight">Cisco Chem</span>
                  </Link>
                </div>

                {/* Mobile Navigation Links */}
                <div className="flex-1 overflow-y-auto px-6 py-8">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-4 px-2">Main Menu</p>
                    <nav className="space-y-1">
                      {navLinks.map(({ href, label }, idx) => (
                        <Link
                          key={href}
                          href={href}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center justify-between px-4 py-3.5 rounded-xl text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 transition-all duration-200 group"
                          style={{
                            animation: `fadeInUp 0.4s ease-out ${idx * 0.05}s both`,
                          }}
                        >
                          <span className="text-[15px] font-semibold tracking-tight">
                            {label}
                          </span>
                          <ChevronRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-zinc-400" />
                        </Link>
                      ))}
                    </nav>
                  </div>

                  <div className="mt-10 pt-10 border-t border-zinc-100 space-y-6">
                    <div className="px-2">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-4">Currency & Language</p>
                      <CurrencyToggle />
                    </div>

                    <div className="space-y-3">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-4 px-2">Account</p>
                      {!user ? (
                        <Link
                          href="/sign-in"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-3 w-full px-4 py-4 rounded-2xl bg-black text-white font-semibold transition-all hover:bg-zinc-800 shadow-sm"
                        >
                          <User className="w-5 h-5" />
                          <span>Login to Account</span>
                        </Link>
                      ) : (
                        <div className="space-y-3">
                          <div className="px-4 py-4 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-white font-bold text-sm">
                              {user.name?.[0]?.toUpperCase() || "U"}
                            </div>
                            <div className="flex flex-col overflow-hidden">
                              <span className="text-sm font-bold text-zinc-900 leading-tight truncate">
                                {user.name}
                              </span>
                              <span className="text-xs text-zinc-500 truncate">
                                {user.email}
                              </span>
                            </div>
                          </div>
                          <Link
                            href="/dashboard"
                            onClick={() => setIsOpen(false)}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition-all shadow-sm"
                          >
                            <LayoutDashboard className="w-4 h-4" />
                            <span>Go to Dashboard</span>
                          </Link>
                          <button
                            onClick={async () => {
                              await signOutAction();
                              setIsOpen(false);
                              toast.success("Signed out successfully");
                            }}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl border border-zinc-200 text-zinc-600 font-semibold hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all"
                          >
                            Sign Out
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Decorative Footer */}
                <div className="p-6 border-t border-zinc-100">
                  <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-[0.3em] text-center">
                    Cisco Chem Global v1.0
                  </p>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-start justify-center pt-20">
          <div className="w-full max-w-2xl mx-4">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
              {/* Search Header */}
              <div className="flex items-center gap-4 p-6 border-b border-gray-200">
                <Search className="w-6 h-6 text-gray-400" />
                <form onSubmit={handleSearch} className="flex-1">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Search products, chemicals, solutions..."
                    className="w-full text-lg bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none"
                    autoFocus
                  />
                </form>
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Search Suggestions */}
              <div className="p-6">
                <div className="space-y-3">
                  <p className="text-sm text-gray-500 font-medium">
                    Quick Searches
                  </p>
                  {[
                    "Industrial Chemicals",
                    "Safety Equipment",
                    "Laboratory Supplies",
                    "Chemical Analysis",
                  ].map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        const val = suggestion;
                        setInputValue(val);
                        router.push(`/products?q=${encodeURIComponent(val)}`);
                        setIsSearchOpen(false);
                      }}
                      className="block w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Search className="w-4 h-4 text-gray-400" />
                        {suggestion}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Styles */}
      <style jsx global>{`
        @keyframes slideInFromRight {
          0% {
            opacity: 0;
            transform: translateX(30px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }

        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Custom breakpoint for extra small screens */
        @media (min-width: 475px) {
          .xs\\:block {
            display: block;
          }
          .xs\\:hidden {
            display: none;
          }
        }

        @media (max-width: 474px) {
          .xs\\:block {
            display: none;
          }
          .xs\\:hidden {
            display: block;
          }
        }
      `}</style>
    </header>
  );
};
