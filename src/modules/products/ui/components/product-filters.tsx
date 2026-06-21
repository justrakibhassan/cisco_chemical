"use client";

import React from "react";
import { Category } from "@/payload-types";
import { Slider } from "@/components/ui/slider";
import { 
  Filter, 
  RotateCcw,
  PackageCheck
} from "lucide-react";

interface ProductFiltersProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (id: string) => void;
  priceRange: [number, number];
  onPriceChange: (range: [number, number]) => void;
  inStock: boolean;
  onInStockChange: (checked: boolean) => void;
  onReset: () => void;
}

export function ProductFilters({
  categories,
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceChange,
  inStock,
  onInStockChange,
  onReset
}: ProductFiltersProps) {
  
  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(0, parseInt(e.target.value) || 0);
    onPriceChange([value, priceRange[1]]);
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(priceRange[0], parseInt(e.target.value) || 0);
    onPriceChange([priceRange[0], value]);
  };

  return (
    <div className="space-y-8 bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-slate-200/50 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-100/50">
            <Filter className="w-4 h-4 text-emerald-600" />
          </div>
          <h3 className="font-black text-slate-900 uppercase tracking-wider text-xs">Catalog Filters</h3>
        </div>
        <button 
          onClick={onReset}
          className="text-[10px] font-bold text-slate-400 hover:text-emerald-600 flex items-center gap-1.5 transition-colors uppercase tracking-wider"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>
      </div>

      {/* Price Range */}
      <div className="space-y-5">
        <div className="flex justify-between items-center ml-1">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Price Limit</h4>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100/50 px-2.5 py-1 rounded-lg">
            ${priceRange[0]} - ${priceRange[1]}
          </span>
        </div>
        
        {/* Slider control */}
        <div className="px-1.5">
          <Slider
            defaultValue={[0, 10000]}
            max={10000}
            step={100}
            value={[priceRange[0], priceRange[1]]}
            onValueChange={(val) => onPriceChange(val as [number, number])}
            className="my-4"
          />
        </div>

        {/* Manual price input boxes */}
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center gap-1.5 px-3 py-2 bg-slate-50 border border-slate-200/60 rounded-xl">
            <span className="text-[10px] font-bold text-slate-400">$</span>
            <input
              type="number"
              placeholder="Min"
              value={priceRange[0]}
              onChange={handleMinPriceChange}
              className="w-full bg-transparent border-none text-xs font-bold text-slate-800 focus:outline-none focus:ring-0 placeholder:text-slate-300"
            />
          </div>
          <span className="text-slate-300 text-xs font-bold">-</span>
          <div className="flex-1 flex items-center gap-1.5 px-3 py-2 bg-slate-50 border border-slate-200/60 rounded-xl">
            <span className="text-[10px] font-bold text-slate-400">$</span>
            <input
              type="number"
              placeholder="Max"
              value={priceRange[1]}
              onChange={handleMaxPriceChange}
              className="w-full bg-transparent border-none text-xs font-bold text-slate-800 focus:outline-none focus:ring-0 placeholder:text-slate-300"
            />
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-4">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Categories</h4>
        <div className="flex flex-col gap-1.5">
          <button
            onClick={() => onCategoryChange("all")}
            className={`w-full text-left px-3 py-2.5 rounded-xl text-xs transition-all duration-200 border-l-4 ${
              selectedCategory === "all" 
                ? "bg-emerald-500/10 text-emerald-700 font-black border-emerald-500 shadow-sm" 
                : "text-slate-600 font-semibold hover:text-slate-900 hover:bg-slate-50 border-transparent"
            }`}
          >
            All Products
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(String(cat.id))}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs transition-all duration-200 border-l-4 ${
                selectedCategory === String(cat.id)
                  ? "bg-emerald-500/10 text-emerald-700 font-black border-emerald-500 shadow-sm"
                  : "text-slate-600 font-semibold hover:text-slate-900 hover:bg-slate-50 border-transparent"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Stock Status Switch */}
      <div className="space-y-4">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Availability</h4>
        <div className="flex items-center justify-between bg-slate-50/50 p-4 rounded-2xl border border-slate-200/40 hover:border-emerald-100 transition-colors">
          <div className="flex items-center gap-2">
            <PackageCheck className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">In Stock Only</span>
          </div>
          
          {/* Custom Switch Toggle */}
          <button
            type="button"
            onClick={() => onInStockChange(!inStock)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              inStock ? "bg-emerald-600" : "bg-slate-200"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                inStock ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>

    </div>
  );
}
