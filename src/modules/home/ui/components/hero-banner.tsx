"use client";

import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";
import { ChevronRight, Beaker, Shield, Zap, Award } from "lucide-react";
import { AnimatedCounter } from "./animated-counter";
import { ScientificOverlay } from "./scientific-overlay";
import { ScientificDashboard } from "./scientific-dashboard";

interface Stat {
  icon: React.ElementType;
  value: string;
  label: string;
}

const stats: Stat[] = [
  { icon: Beaker, value: "500+", label: "Compounds" },
  { icon: Shield, value: "99.9%", label: "Purity Assay" },
  { icon: Zap, value: "50+", label: "Patents" },
  { icon: Award, value: "25+", label: "Certifications" },
];

export const HeroBanner: React.FC = () => {
  return (
    <section className="relative min-h-screen w-full flex flex-col justify-center pt-24 lg:pt-20 pb-10 overflow-hidden bg-slate-50 text-slate-900 border-b border-slate-200/80">
      
      {/* Blueprint Grid pattern */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35 pointer-events-none" />
      
      {/* Ambient Lighting */}
      <div className="absolute top-1/4 left-1/3 w-[550px] h-[550px] rounded-full blur-[130px] -z-10 pointer-events-none bg-emerald-500/10" />
      <div className="absolute top-1/3 right-1/4 w-[480px] h-[480px] rounded-full blur-[120px] -z-10 pointer-events-none bg-teal-500/10" />

      {/* Scientific Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <ScientificOverlay />
      </div>

      <div className="max-w-[1720px] relative z-20 mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Clean, Minimal, Direct Copy, CTAs & Metrics */}
          <div className="lg:col-span-6 space-y-6 flex flex-col justify-center">
            
            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl xs:text-5xl sm:text-5xl lg:text-[3.85rem] font-black leading-[1.08] tracking-tight text-slate-950"
            >
              High-Purity Chemicals for{" "}
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 bg-clip-text text-transparent">
                Global Industry
              </span>
            </motion.h1>

            {/* Direct Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed max-w-xl"
            >
              Synthesizing certified specialty compounds, industrial solvents, and custom formulations with analytical batch precision for enterprise manufacturing.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-wrap items-center gap-4 pt-1"
            >
              <Link
                href="/products"
                className="group relative inline-flex items-center justify-center px-7 py-3.5 bg-emerald-600 rounded-xl text-white font-bold text-sm sm:text-base hover:bg-emerald-700 transition-all duration-200 shadow-lg shadow-emerald-600/20 hover:-translate-y-0.5 active:translate-y-0"
              >
                Explore Products
                <ChevronRight className="ml-1.5 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/quick-order"
                className="inline-flex items-center justify-center px-7 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm sm:text-base border border-slate-300/90 shadow-xs rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
              >
                Request a Quote
              </Link>
            </motion.div>

            {/* Metrics Matrix positioned directly under CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-200/80"
            >
              {stats.map((stat, idx) => (
                <div key={idx} className="flex flex-col">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="p-1.5 bg-emerald-50 rounded-lg border border-emerald-100 text-emerald-600">
                      <stat.icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xl sm:text-2xl font-black text-slate-950 leading-none">
                      <AnimatedCounter
                        endValue={stat.value}
                        hasPlus={stat.value.includes("+")}
                        hasPercent={stat.value.includes("%")}
                      />
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                    {stat.label}
                  </span>
                </div>
              ))}
            </motion.div>

          </div>

          {/* Right Column: Initial Interactive Scientific Dashboard */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            className="lg:col-span-6 w-full flex justify-center"
          >
            <ScientificDashboard slideIndex={0} />
          </motion.div>

        </div>
      </div>

    </section>
  );
};

export default HeroBanner;
