"use client";

import React from "react";
import { useCurrency } from "@/providers/currency-provider";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export const CurrencyToggle = () => {
  const { currency, setCurrency } = useCurrency();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const activeCurrency = mounted ? currency : "USD";

  return (
    <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-full border border-gray-200 shadow-inner">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setCurrency("USD")}
        className={`relative rounded-full px-3 h-8 transition-all ${
          activeCurrency === "USD" 
            ? "text-white font-bold hover:bg-transparent hover:text-white" 
            : "text-gray-500 hover:text-gray-900 hover:bg-gray-200/50"
        }`}
      >
        {activeCurrency === "USD" && (
          <motion.div
            layoutId="currency-tab"
            className="absolute inset-0 bg-green-600 rounded-full shadow-md"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
        <span className="relative z-10">$ USD</span>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => setCurrency("EUR")}
        className={`relative rounded-full px-3 h-8 transition-all ${
          activeCurrency === "EUR" 
            ? "text-white font-bold hover:bg-transparent hover:text-white" 
            : "text-gray-500 hover:text-gray-900 hover:bg-gray-200/50"
        }`}
      >
        {activeCurrency === "EUR" && (
          <motion.div
            layoutId="currency-tab"
            className="absolute inset-0 bg-green-600 rounded-full shadow-md"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
        <span className="relative z-10">€ EUR</span>
      </Button>
    </div>
  );
};
