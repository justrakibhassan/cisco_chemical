"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ShoppingCart, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/payload-types";
import { useCurrency } from "@/providers/currency-provider";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  onAddToCart: () => void;
  layoutMode?: "grid" | "list";
}

export function ProductCard({ 
  product, 
  onAddToCart,
  layoutMode = "grid"
}: ProductCardProps) {
  const router = useRouter();
  const { formatPrice } = useCurrency();
  
  const image = typeof product.mainImage === "object" && product.mainImage !== null
    ? (product.mainImage as { url?: string }).url
    : null;
    
  const categoryName = typeof product.category === "object" && product.category !== null
    ? (product.category as { name: string }).name
    : "Chemical";

  const isOutOfStock = product.stock === 0;

  // GRID VIEW CARD
  if (layoutMode === "grid") {
    return (
      <div className="group bg-white rounded-3xl border border-slate-150/60 shadow-[0_8px_30px_rgb(0,0,0,0.015)] hover:shadow-[0_24px_48px_rgba(16,185,129,0.06)] hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col h-full relative">
        {/* Image Frame */}
        <div 
          className="relative h-60 w-full overflow-hidden bg-slate-50 cursor-pointer shrink-0" 
          onClick={() => router.push(`/products/${product.slug}`)}
        >
          <Image
            src={image || "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute top-4 left-4 z-10">
            <span className="bg-white/90 backdrop-blur-md text-slate-800 border border-slate-200/50 px-3 py-1 rounded-full text-[9px] font-black tracking-wider uppercase shadow-sm">
              {categoryName}
            </span>
          </div>
          {isOutOfStock && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] flex items-center justify-center z-10">
              <Badge variant="destructive" className="px-5 py-1.5 rounded-full font-black text-xs uppercase tracking-widest">
                Out Of Stock
              </Badge>
            </div>
          )}
        </div>

        {/* Content Box */}
        <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
          <div className="space-y-3">
            {/* Title & Price */}
            <div>
              <h3 
                className="text-base sm:text-lg font-black text-slate-950 leading-snug group-hover:text-emerald-600 transition-colors cursor-pointer truncate" 
                onClick={() => router.push(`/products/${product.slug}`)}
              >
                {product.name}
              </h3>
              
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xl font-black text-slate-900">{formatPrice(product.price)}</span>
                {product.oldPrice && (
                  <span className="text-xs text-slate-400 line-through font-bold">{formatPrice(product.oldPrice)}</span>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-slate-500 font-semibold leading-relaxed line-clamp-2">
              {typeof product.description === "string" ? product.description : "Advanced chemical solution for industrial applications."}
            </p>
          </div>

          {/* Action Row */}
          <div className="grid grid-cols-2 gap-2 mt-6">
            <button
              onClick={(e) => { e.stopPropagation(); onAddToCart(); }}
              disabled={isOutOfStock}
              className="flex items-center justify-center gap-1.5 py-3 bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 rounded-xl font-bold text-xs transition-all border border-slate-200/40 disabled:opacity-50 disabled:cursor-not-allowed group/btn shadow-sm"
            >
              <ShoppingCart className="w-3.5 h-3.5 group-hover/btn:scale-105 transition-transform" />
              <span>Cart</span>
            </button>
            
            <button
              onClick={(e) => { e.stopPropagation(); onAddToCart(); router.push('/cart'); }}
              disabled={isOutOfStock}
              className="flex items-center justify-center gap-1 py-3 bg-slate-950 hover:bg-emerald-600 text-white rounded-xl font-bold text-xs transition-all shadow-sm hover:shadow-emerald-100 hover:shadow-md active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Buy Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // LIST VIEW CARD
  return (
    <div className="group bg-white rounded-3xl border border-slate-150/60 shadow-[0_8px_30px_rgb(0,0,0,0.015)] hover:shadow-[0_24px_48px_rgba(16,185,129,0.06)] hover:-translate-y-0.5 transition-all duration-300 overflow-hidden flex flex-col md:flex-row w-full">
      {/* Image Frame */}
      <div 
        className="relative w-full md:w-64 h-52 md:h-auto overflow-hidden bg-slate-50 cursor-pointer shrink-0 min-h-[180px]" 
        onClick={() => router.push(`/products/${product.slug}`)}
      >
        <Image
          src={image || "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop"}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-white/90 backdrop-blur-md text-slate-800 border border-slate-200/50 px-3 py-1 rounded-full text-[9px] font-black tracking-wider uppercase shadow-sm">
            {categoryName}
          </span>
        </div>
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] flex items-center justify-center z-10">
            <Badge variant="destructive" className="px-5 py-1.5 rounded-full font-black text-xs uppercase tracking-widest">
              Out Of Stock
            </Badge>
          </div>
        )}
      </div>

      {/* Content Frame */}
      <div className="p-6 flex-1 flex flex-col md:flex-row md:items-center gap-6 justify-between">
        
        {/* Info Column */}
        <div className="flex-1 space-y-3 min-w-0">
          <h3 
            className="text-lg sm:text-xl font-black text-slate-950 leading-tight group-hover:text-emerald-600 transition-colors cursor-pointer truncate" 
            onClick={() => router.push(`/products/${product.slug}`)}
          >
            {product.name}
          </h3>
          
          <p className="text-xs text-slate-500 font-semibold leading-relaxed max-w-xl line-clamp-3">
            {typeof product.description === "string" ? product.description : "Advanced chemical solution for industrial applications."}
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            <span className="inline-flex items-center text-[9px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-200/30 uppercase tracking-wider">
              REACH Compliant
            </span>
            <span className="inline-flex items-center text-[9px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-200/30 uppercase tracking-wider">
              Formula Verified
            </span>
          </div>
        </div>

        {/* Action Column */}
        <div className="w-full md:w-52 flex flex-col justify-center shrink-0 pl-0 md:pl-6 border-t md:border-t-0 md:border-l border-slate-100 gap-4 pt-4 md:pt-0">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-slate-950 leading-none">
                {formatPrice(product.price)}
              </span>
              {product.oldPrice && (
                <span className="text-xs text-slate-400 line-through font-bold">
                  {formatPrice(product.oldPrice)}
                </span>
              )}
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">
              Bulk pricing available
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); onAddToCart(); }}
              disabled={isOutOfStock}
              className="flex items-center justify-center gap-1.5 py-2.5 bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 rounded-xl font-bold text-xs transition-all border border-slate-200/40 disabled:opacity-50 disabled:cursor-not-allowed group/btn shadow-sm flex-1"
            >
              <ShoppingCart className="w-3.5 h-3.5 group-hover/btn:scale-105 transition-transform" />
              <span>Add to Cart</span>
            </button>
            
            <button
              onClick={(e) => { e.stopPropagation(); onAddToCart(); router.push('/cart'); }}
              disabled={isOutOfStock}
              className="flex items-center justify-center gap-1 py-2.5 bg-slate-950 hover:bg-emerald-600 text-white rounded-xl font-bold text-xs transition-all shadow-sm hover:shadow-emerald-100 hover:shadow-md active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed flex-1"
            >
              <span>Buy Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
