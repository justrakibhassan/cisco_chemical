"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Package, ClipboardList, User as UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { User as UserType } from "@/payload-types";

interface BottomNavProps {
  user?: UserType | null;
}

export const BottomNav = ({ user }: BottomNavProps) => {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    {
      label: "Home",
      href: "/",
      icon: Home,
    },
    {
      label: "Products",
      href: "/products",
      icon: Package,
    },
    {
      label: "Orders",
      href: "/orders",
      icon: ClipboardList,
    },
    {
      label: "Account",
      href: user ? "/dashboard" : "/sign-in",
      icon: UserIcon,
    },
  ];

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 lg:hidden w-[95%] max-w-md">
      <div className="bg-white/85 backdrop-blur-xl border border-white/40 rounded-3xl p-2 flex items-center justify-between shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = mounted && pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-col items-center justify-center w-[4.5rem] h-14 z-10 select-none outline-none"
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              {isActive && (
                <motion.div
                  layoutId="bottom-nav-active"
                  className="absolute inset-0 bg-green-500/10 rounded-2xl"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 30,
                  }}
                />
              )}
              
              <motion.div
                whileTap={{ scale: 0.85 }}
                animate={{
                  y: isActive ? -2 : 0,
                }}
                className="relative flex flex-col items-center justify-center w-full h-full"
              >
                <div className="relative">
                  <Icon 
                    className={cn(
                      "w-5 h-5 transition-all duration-300", 
                      isActive ? "text-green-600 stroke-[2.5px]" : "text-zinc-500"
                    )} 
                  />
                  
                </div>

                <motion.span 
                  initial={false}
                  animate={{
                    opacity: isActive ? 1 : 0.6,
                    scale: isActive ? 1 : 0.9,
                    y: isActive ? 0 : 2
                  }}
                  className={cn(
                    "text-[10px] font-medium mt-1 transition-colors duration-300",
                    isActive ? "text-green-700" : "text-zinc-500"
                  )}
                >
                  {item.label}
                </motion.span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
