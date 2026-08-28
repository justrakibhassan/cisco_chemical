export const ProductsHeader = () => {
  return (
    <div className="relative overflow-hidden py-16 sm:py-24 bg-[#0A0F0D]">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#10b981_0%,transparent_50%)]"></div>
      </div>

      <div className="relative max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-12 text-center">

        <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-[1.1] tracking-tight">
          PREMIUM<br />
          <span className="text-emerald-500">CHEMICAL PRODUCTS</span>
        </h1>

        <p className="text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed text-slate-400 font-medium">
          Discover our comprehensive range of high-purity chemicals engineered
          for industrial excellence and sustainable innovation.
        </p>

        <div className="flex items-center justify-center gap-12 text-slate-500">
          <div className="text-center">
            <div className="text-2xl font-black text-white">500+</div>
            <div className="text-[10px] uppercase font-bold tracking-widest mt-1">Products</div>
          </div>
          <div className="w-px h-8 bg-white/10"></div>
          <div className="text-center">
            <div className="text-2xl font-black text-white">99.9%</div>
            <div className="text-[10px] uppercase font-bold tracking-widest mt-1">Purity</div>
          </div>
          <div className="w-px h-8 bg-white/10"></div>
          <div className="text-center">
            <div className="text-2xl font-black text-white">24/7</div>
            <div className="text-[10px] uppercase font-bold tracking-widest mt-1">Support</div>
          </div>
        </div>
      </div>
    </div>
  );
};
