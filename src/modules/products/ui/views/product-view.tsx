"use client";

import { useState, useEffect, useCallback } from "react";
import { useQueryState, parseAsInteger, parseAsBoolean } from "nuqs";
import { Search, SlidersHorizontal, X, Grid, List } from "lucide-react";
import { Product, Category } from "@/payload-types";
import { useCart } from "@/hooks/use-cart";
import {
  getFilteredProductsAction,
  getCategoriesAction,
} from "@/modules/products/actions";
import { ProductFilters } from "../components/product-filters";
import { ProductCard } from "../components/product-card";
import { cn } from "@/lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

interface ProductsViewProps {
  initialProducts?: Product[];
}

const EMPTY_ARRAY: Product[] = [];

export function ProductsView({
  initialProducts = EMPTY_ARRAY,
}: ProductsViewProps) {
  const { addToCart } = useCart();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Query State
  const [search, setSearch] = useQueryState("q", { defaultValue: "" });
  const [category, setCategory] = useQueryState("category", {
    defaultValue: "all",
  });
  const [minPrice, setMinPrice] = useQueryState(
    "min",
    parseAsInteger.withDefault(0),
  );
  const [maxPrice, setMaxPrice] = useQueryState(
    "max",
    parseAsInteger.withDefault(10000),
  );
  const [inStock, setInStock] = useQueryState(
    "stock",
    parseAsBoolean.withDefault(false),
  );
  const [sort, setSort] = useQueryState("sort", { defaultValue: "-createdAt" });
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));

  // Data State
  const [loading, setLoading] = useState(initialProducts.length === 0);
  const [data, setData] = useState<{
    products: Product[];
    totalDocs: number;
    totalPages: number;
  }>({
    products: initialProducts,
    totalDocs: initialProducts.length,
    totalPages: Math.ceil(initialProducts.length / 12) || 1,
  });
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const result = await getFilteredProductsAction({
      query: search || undefined,
      category,
      minPrice,
      maxPrice,
      inStock,
      sort,
      page,
      limit: 12,
    });
    setData({
      products: result.products,
      totalDocs: result.totalDocs,
      totalPages: result.totalPages,
    });
    setLoading(false);
  }, [search, category, minPrice, maxPrice, inStock, sort, page]);

  useEffect(() => {
    // Check if we have any active filters
    const hasActiveFilters =
      (search && search !== "") ||
      category !== "all" ||
      minPrice > 0 ||
      maxPrice < 10000 ||
      inStock ||
      page > 1;

    // Fetch if we have no initial products OR if filters are active
    if (initialProducts.length === 0 || hasActiveFilters) {
      fetchProducts();
    } else {
      setData({
        products: initialProducts,
        totalDocs: initialProducts.length,
        totalPages: Math.ceil(initialProducts.length / 12) || 1,
      });
      setLoading(false);
    }
  }, [
    fetchProducts,
    initialProducts,
    search,
    category,
    minPrice,
    maxPrice,
    inStock,
    page,
  ]);

  useEffect(() => {
    const fetchCats = async () => {
      const cats = await getCategoriesAction();
      setCategories(cats);
    };
    fetchCats();
  }, []);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-12 py-12 lg:py-20">
        <div className="flex flex-col gap-8">
          
          {/* Mobile Filter Trigger & Toolbar */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 font-semibold" />
                  <input
                    type="text"
                    placeholder="Search catalog chemicals..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                    className="w-full pl-11 pr-4 py-3 bg-white rounded-2xl border border-slate-200/60 text-xs font-bold focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:outline-none transition-all placeholder:text-slate-300 shadow-sm"
                  />
                </div>
                
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="lg:hidden flex items-center gap-2 rounded-2xl border-slate-100 bg-white h-11 px-4 font-black text-[10px] uppercase tracking-widest shadow-sm">
                      <SlidersHorizontal className="w-4 h-4" />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-full sm:w-[350px] p-0 border-r-0">
                    <div className="h-full overflow-y-auto p-6 pt-10">
                      <SheetHeader className="mb-8">
                        <SheetTitle className="text-left font-black text-2xl tracking-tighter uppercase">Filters</SheetTitle>
                        <SheetDescription className="text-left font-medium text-slate-500">Simplify your chemical search</SheetDescription>
                      </SheetHeader>
                      <ProductFilters
                        categories={categories}
                        selectedCategory={category}
                        onCategoryChange={(val) => {
                          setCategory(val);
                          setPage(1);
                        }}
                        priceRange={[minPrice, maxPrice]}
                        onPriceChange={(range) => {
                          setMinPrice(range[0]);
                          setMaxPrice(range[1]);
                          setPage(1);
                        }}
                        inStock={inStock}
                        onInStockChange={(val) => {
                          setInStock(val);
                          setPage(1);
                        }}
                        onReset={() => {
                          setCategory("all");
                          setMinPrice(0);
                          setMaxPrice(10000);
                          setInStock(false);
                          setSearch("");
                          setPage(1);
                        }}
                      />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              {/* Toolbar Actions: Sort & Layout Switcher */}
              <div className="flex items-center gap-3 shrink-0">
                <Select value={sort} onValueChange={(val) => setSort(val)}>
                  <SelectTrigger className="w-[180px] rounded-2xl border-slate-200 bg-white h-11 font-black text-slate-700 text-[10px] uppercase tracking-widest shadow-sm">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-slate-150 shadow-lg">
                    <SelectItem value="-createdAt" className="font-bold text-[10px] uppercase tracking-wider">Newest First</SelectItem>
                    <SelectItem value="price" className="font-bold text-[10px] uppercase tracking-wider">Price: Low to High</SelectItem>
                    <SelectItem value="-price" className="font-bold text-[10px] uppercase tracking-wider">Price: High to Low</SelectItem>
                    <SelectItem value="name" className="font-bold text-[10px] uppercase tracking-wider">Name: A to Z</SelectItem>
                  </SelectContent>
                </Select>

                {/* Grid / List switcher */}
                <div className="hidden sm:flex items-center gap-1 bg-white p-1 rounded-2xl border border-slate-200/60 shadow-sm h-11">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={cn(
                      "p-2 rounded-xl transition-all duration-200",
                      viewMode === "grid"
                        ? "bg-slate-950 text-white shadow-sm"
                        : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                    )}
                    aria-label="Grid layout"
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={cn(
                      "p-2 rounded-xl transition-all duration-200",
                      viewMode === "list"
                        ? "bg-slate-950 text-white shadow-sm"
                        : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                    )}
                    aria-label="List layout"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filter Chips */}
            {(category !== "all" || inStock || search) && (
              <div className="flex flex-wrap gap-2">
                {category !== "all" && (
                   <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-100/50 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">
                     <span>Category: {categories.find(c => String(c.id) === category)?.name || category}</span>
                     <button onClick={() => setCategory("all")} className="hover:text-emerald-950"><X className="w-3.5 h-3.5"/></button>
                   </div>
                )}
                {inStock && (
                   <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-100/50 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">
                     <span>In Stock Only</span>
                     <button onClick={() => setInStock(false)} className="hover:text-emerald-950"><X className="w-3.5 h-3.5"/></button>
                   </div>
                )}
                {search && (
                   <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-100/50 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">
                     <span>Query: &ldquo;{search}&rdquo;</span>
                     <button onClick={() => setSearch("")} className="hover:text-emerald-950"><X className="w-3.5 h-3.5"/></button>
                   </div>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Desktop Filters Sidebar */}
            <aside className="hidden lg:block lg:w-80 shrink-0">
              <div className="sticky top-28">
                <ProductFilters
                  categories={categories}
                  selectedCategory={category}
                  onCategoryChange={(val) => {
                    setCategory(val);
                    setPage(1);
                  }}
                  priceRange={[minPrice, maxPrice]}
                  onPriceChange={(range) => {
                    setMinPrice(range[0]);
                    setMaxPrice(range[1]);
                    setPage(1);
                  }}
                  inStock={inStock}
                  onInStockChange={(val) => {
                    setInStock(val);
                    setPage(1);
                  }}
                  onReset={() => {
                    setCategory("all");
                    setMinPrice(0);
                    setMaxPrice(10000);
                    setInStock(false);
                    setSearch("");
                    setPage(1);
                  }}
                />
              </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 space-y-8">
              {/* Products Container */}
              {loading ? (
                <div className={cn(
                  viewMode === "grid" 
                    ? "grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6" 
                    : "flex flex-col gap-4"
                )}>
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className={cn(
                      "space-y-4 bg-white/60 p-4 border border-slate-100 rounded-3xl shadow-sm",
                      viewMode === "list" && "flex flex-col md:flex-row gap-6 p-6 items-center"
                    )}>
                      <Skeleton className={cn(
                        viewMode === "grid" ? "h-48 sm:h-64 w-full" : "h-40 w-full md:w-64 shrink-0",
                        "rounded-2xl"
                      )} />
                      <div className="flex-1 space-y-3 w-full">
                        <Skeleton className="h-5 w-2/3" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : data.products.length > 0 ? (
                <div className={cn(
                  viewMode === "grid" 
                    ? "grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6" 
                    : "flex flex-col gap-5"
                )}>
                  {data.products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      layoutMode={viewMode}
                      onAddToCart={() =>
                        addToCart({
                          id: String(product.id),
                          name: product.name,
                          price: product.price,
                          image:
                            typeof product.mainImage === "object" &&
                            product.mainImage !== null
                              ? (product.mainImage as { url?: string }).url || ""
                              : "",
                          slug: product.slug || "",
                        })
                      }
                    />
                  ))}
                </div>
              ) : (
                <NoResults
                  onClear={() => {
                    setSearch("");
                    setCategory("all");
                    setMinPrice(0);
                    setMaxPrice(10000);
                    setInStock(false);
                    setPage(1);
                  }}
                />
              )}

              {/* Pagination Section */}
              {data.totalPages > 1 && (
                <div className="flex justify-center pt-8 sm:pt-12">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => page > 1 && handlePageChange(page - 1)}
                          className={`cursor-pointer ${page === 1 ? "opacity-50 pointer-events-none" : ""}`}
                        />
                      </PaginationItem>

                      {[...Array(data.totalPages)].map((_, i) => {
                        const p = i + 1;
                        return (
                          <PaginationItem key={p} className="hidden sm:inline-block">
                            <PaginationLink
                              isActive={page === p}
                              onClick={() => handlePageChange(p)}
                              className="cursor-pointer"
                            >
                              {p}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      })}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() =>
                            page < data.totalPages && handlePageChange(page + 1)
                          }
                          className={`cursor-pointer ${page === data.totalPages ? "opacity-50 pointer-events-none" : ""}`}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

function NoResults({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-200/40">
      <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center shadow-md mb-6 border border-slate-100">
        <Search className="w-10 h-10 text-slate-250" />
      </div>
      <h3 className="text-2xl font-black text-slate-900 mb-2">
        No matches found
      </h3>
      <p className="text-slate-500 font-semibold mb-8 text-sm">
        Try adjusting your filters or search terms
      </p>
      <button
        onClick={onClear}
        className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs shadow-lg shadow-emerald-150 hover:bg-emerald-700 active:scale-95 transition-all uppercase tracking-widest"
      >
        Reset All Filters
      </button>
    </div>
  );
}
