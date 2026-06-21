"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  Play,
  Beaker,
  Shield,
  Zap,
  Award,
  Microscope,
  Atom,
  Search,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { AnimatedCounter } from "./animated-counter";
import { ScientificOverlay } from "./scientific-overlay";
import { ScientificDashboard } from "./scientific-dashboard";
import { cn } from "@/lib/utils";

interface Slide {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  accent: string;
  accentGlow: string;
  icon: React.ElementType;
}

interface Stat {
  icon: React.ElementType;
  value: string;
  label: string;
}

const HeroBanner: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const slides: Slide[] = [
    {
      title: "Advanced Chemical Engineering",
      subtitle: "Precision. Innovation. Excellence.",
      description:
        "Developing high-purity compounds and innovative chemical solutions that empower global industries through scientific rigor and advanced manufacturing.",
      image: "/images/hero-lab.png",
      accent: "text-emerald-600 dark:text-emerald-400",
      accentGlow: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
      icon: Microscope,
    },
    {
      title: "Industrial Scale Solutions",
      subtitle: "Powering Global Infrastructure",
      description:
        "Our state-of-the-art manufacturing facilities deliver consistent quality and massive scale for the world's most demanding industrial applications.",
      image: "/images/hero-industrial.png",
      accent: "text-blue-650 dark:text-blue-400",
      accentGlow: "bg-blue-500/10 text-blue-600 border-blue-500/20",
      icon: Atom,
    },
    {
      title: "Molecular Research & Design",
      subtitle: "The Future of Material Science",
      description:
        "Pushing the boundaries of chemistry to create sustainable, high-performance materials through advanced molecular modeling and research.",
      image: "/images/hero-molecular.png",
      accent: "text-cyan-650 dark:text-cyan-400",
      accentGlow: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20",
      icon: Sparkles,
    },
  ];

  const stats: Stat[] = [
    { icon: Beaker, value: "500+", label: "Research Compounds" },
    { icon: Shield, value: "99.9%", label: "Quality Assurance" },
    { icon: Zap, value: "50+", label: "Global Patents" },
    { icon: Award, value: "25+", label: "Industry Certifications" },
  ];

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setProgress(0);
  }, [slides.length]);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          nextSlide();
          return 0;
        }
        return prev + 0.5;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [nextSlide, isPaused]);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <section className="relative min-h-screen w-full flex flex-col justify-between pt-28 lg:pt-24 pb-12 overflow-hidden bg-slate-50 text-slate-900 border-b border-slate-200/60">
      
      {/* Ambient background images */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`bg-image-${currentSlide}`}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 0.18, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0 z-0 pointer-events-none select-none"
        >
          <Image
            src={slides[currentSlide].image}
            alt={slides[currentSlide].title}
            fill
            className="object-cover filter blur-[2px]"
            priority
          />
        </motion.div>
      </AnimatePresence>

      {/* Grid pattern & visual accent rings */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35" />
      
      <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] rounded-full bg-emerald-400/10 blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] rounded-full bg-blue-400/10 blur-[100px] -z-10 pointer-events-none" />

      {/* Technical Overlay - Stays on top of images but below text */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <ScientificOverlay />
      </div>

      <div className="container relative z-20 mx-auto px-4 sm:px-6 lg:px-12 flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center my-auto">
          
          {/* Left Content Area */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-8 flex flex-col justify-center">
            
            {/* Tech Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="self-start inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/80 backdrop-blur-md rounded-full border border-slate-200/80 shadow-sm"
            >
              <span className="text-[10px] font-black tracking-[0.2em] uppercase text-slate-600 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                Next-Gen Chemistry
              </span>
            </motion.div>

            {/* Typography */}
            <div className="space-y-4">
              <AnimatePresence mode="wait">
                <motion.h1
                  key={`title-${currentSlide}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="text-4xl xs:text-5xl sm:text-6xl lg:text-[4.5rem] font-black leading-[1.05] tracking-tight text-slate-950"
                >
                  <span className="block opacity-95">
                    {slides[currentSlide].title.split(" ").slice(0, -2).join(" ")}
                  </span>
                  <span className={cn("block bg-gradient-to-r from-slate-900 to-emerald-800 bg-clip-text text-transparent italic lg:not-italic", slides[currentSlide].accent)}>
                    {slides[currentSlide].title.split(" ").slice(-2).join(" ")}
                  </span>
                </motion.h1>
              </AnimatePresence>

              <AnimatePresence mode="wait">
                <motion.div
                  key={`desc-${currentSlide}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-4"
                >
                  <p className="text-lg sm:text-xl text-slate-800 font-bold leading-normal border-l-4 border-emerald-500 pl-4 max-w-xl">
                    {slides[currentSlide].subtitle}
                  </p>
                  <p className="text-sm sm:text-base text-slate-500 font-semibold leading-relaxed max-w-lg">
                    {slides[currentSlide].description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Compound Quick Access Search */}
            <motion.form
              onSubmit={handleHeroSearch}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-lg p-1.5 focus-within:border-emerald-500/50 focus-within:ring-4 focus-within:ring-emerald-500/10 transition-all duration-300"
            >
              <div className="pl-3 text-slate-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                placeholder="Search chemical compounds, solutions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent border-none text-slate-900 text-sm font-semibold pl-2 focus:outline-none focus:ring-0 placeholder:text-slate-400"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-slate-950 text-white rounded-xl text-xs font-bold hover:bg-emerald-600 transition-colors shadow-md flex items-center gap-1.5"
              >
                <span>Find</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </motion.form>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                href="/products"
                className="group relative inline-flex items-center justify-center px-7 py-4 bg-emerald-600 rounded-2xl text-white font-bold text-sm sm:text-base hover:bg-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-emerald-100 shadow-emerald-250 hover:-translate-y-0.5 active:translate-y-0"
              >
                Explore Solutions
                <ChevronRight className="ml-1.5 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-7 py-4 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm sm:text-base border border-slate-200 shadow-md rounded-2xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 group"
              >
                <div className="w-6 h-6 bg-slate-100 group-hover:bg-emerald-100 rounded-full flex items-center justify-center mr-2.5 transition-colors">
                  <Play className="w-2.5 h-2.5 text-slate-600 group-hover:text-emerald-600 fill-current ml-0.5" />
                </div>
                Request Information
              </Link>
            </motion.div>

          </div>

          {/* Right Dashboard Area */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="lg:col-span-6 w-full flex justify-center"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <ScientificDashboard slideIndex={currentSlide} />
          </motion.div>

        </div>
      </div>

      {/* Bottom Footer Section: Stats & Progress Bar */}
      <div className="container relative z-20 mx-auto px-4 sm:px-6 lg:px-12 mt-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-8 border-t border-slate-200/80">
          
          {/* Re-styled Stats bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-12 w-full md:w-auto">
            {stats.map((stat, idx) => (
              <div key={idx} className="group cursor-default">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-100/50 group-hover:bg-emerald-100/60 transition-colors">
                    <stat.icon className="w-4 h-4 text-emerald-650" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xl sm:text-2xl font-black text-slate-950 leading-none">
                      <AnimatedCounter
                        endValue={stat.value}
                        hasPlus={stat.value.includes("+")}
                        hasPercent={stat.value.includes("%")}
                      />
                    </span>
                    <span className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                      {stat.label}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Slide Navigation & Dynamic Progress */}
          <div className="flex items-center gap-6">
            <div className="flex gap-2">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCurrentSlide(idx);
                    setProgress(0);
                  }}
                  className={`h-2.5 rounded-full transition-all duration-500 ${
                    currentSlide === idx
                      ? "w-12 bg-emerald-600 shadow-sm"
                      : "w-2.5 bg-slate-200 hover:bg-slate-350"
                  }`}
                />
              ))}
            </div>
            
            {/* Progress Circular Dial */}
            <div className="relative w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md border border-slate-100 overflow-hidden">
              <svg className="w-full h-full p-1.5 origin-center -rotate-90">
                <circle
                  cx="16"
                  cy="16"
                  r="14"
                  className="stroke-slate-100"
                  strokeWidth="1.5"
                  fill="none"
                  transform="translate(2.5, 2.5)"
                />
                <motion.circle
                  cx="16"
                  cy="16"
                  r="14"
                  className="stroke-emerald-600"
                  strokeWidth="2.5"
                  fill="none"
                  strokeDasharray="88"
                  strokeDashoffset={88 - (88 * progress) / 100}
                  transform="translate(2.5, 2.5)"
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute text-xs font-black text-slate-900">
                0{currentSlide + 1}
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
