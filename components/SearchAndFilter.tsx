"use client";

import { useState, useCallback, useMemo } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Slider } from "./ui/slider";
import { Checkbox } from "./ui/checkbox";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";

interface Filters {
  categories: string[];
  conditions: string[];
  priceRange: [number, number];
  sortBy: string;
}

interface SearchAndFilterProps {
  onSearchChange?: (query: string) => void;
  onFiltersChange?: (filters: Filters) => void;
}

const CATEGORIES = [
  "Academic Textbooks",
  "Fiction & Literature",
  "Self-Help & Growth",
  "Business & Economics",
  "Science & Technology",
  "Children's Books"
] as const;

const CONDITIONS = ["New", "Like New", "Very Good", "Good", "Fair"] as const;

const SORT_OPTIONS = [
  { value: "relevance", label: "Relevance" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "newest", label: "Newest First" },
  { value: "rating", label: "Highest Rated" }
] as const;

const DEFAULT_PRICE_RANGE: [number, number] = [0, 300];

export function SearchAndFilter({ onSearchChange, onFiltersChange }: SearchAndFilterProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>(DEFAULT_PRICE_RANGE);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("relevance");

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    onSearchChange?.(value);
  }, [onSearchChange]);

  const toggleCategory = useCallback((category: string) => {
    setSelectedCategories(prev => {
      const newCategories = prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category];

      // Notify after state update
      setTimeout(() => {
        onFiltersChange?.({
          categories: newCategories,
          conditions: selectedConditions,
          priceRange,
          sortBy
        });
      }, 0);

      return newCategories;
    });
  }, [selectedConditions, priceRange, sortBy, onFiltersChange]);

  const toggleCondition = useCallback((condition: string) => {
    setSelectedConditions(prev => {
      const newConditions = prev.includes(condition)
        ? prev.filter(c => c !== condition)
        : [...prev, condition];

      // Notify after state update
      setTimeout(() => {
        onFiltersChange?.({
          categories: selectedCategories,
          conditions: newConditions,
          priceRange,
          sortBy
        });
      }, 0);

      return newConditions;
    });
  }, [selectedCategories, priceRange, sortBy, onFiltersChange]);

  const handlePriceChange = useCallback((value: number[]) => {
    const newRange: [number, number] = [value[0], value[1]];
    setPriceRange(newRange);

    // Notify after state update
    setTimeout(() => {
      onFiltersChange?.({
        categories: selectedCategories,
        conditions: selectedConditions,
        priceRange: newRange,
        sortBy
      });
    }, 0);
  }, [selectedCategories, selectedConditions, sortBy, onFiltersChange]);

  const handleSortChange = useCallback((value: string) => {
    setSortBy(value);

    // Notify after state update
    setTimeout(() => {
      onFiltersChange?.({
        categories: selectedCategories,
        conditions: selectedConditions,
        priceRange,
        sortBy: value
      });
    }, 0);
  }, [selectedCategories, selectedConditions, priceRange, onFiltersChange]);

  const clearAllFilters = useCallback(() => {
    setSelectedCategories([]);
    setSelectedConditions([]);
    setPriceRange(DEFAULT_PRICE_RANGE);
    setSortBy("relevance");

    onFiltersChange?.({
      categories: [],
      conditions: [],
      priceRange: DEFAULT_PRICE_RANGE,
      sortBy: "relevance"
    });
  }, [onFiltersChange]);

  const activeFiltersCount = useMemo(() => {
    let count = selectedCategories.length + selectedConditions.length;
    if (priceRange[0] > DEFAULT_PRICE_RANGE[0] || priceRange[1] < DEFAULT_PRICE_RANGE[1]) {
      count += 1;
    }
    return count;
  }, [selectedCategories.length, selectedConditions.length, priceRange]);

  const FilterSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold tracking-wide text-slate-900 dark:text-slate-100 uppercase">
        {title}
      </h3>
      {children}
    </div>
  );

  const FilterContent = () => (
    <div className="space-y-8 px-1">
      {/* Sort */}
      <FilterSection title="Sort By">
        <Select value={sortBy} onValueChange={handleSortChange}>
          <SelectTrigger className="w-full h-11 text-base border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-600">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-lg">
            {SORT_OPTIONS.map(option => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="text-base py-2.5 cursor-pointer"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FilterSection>

      {/* Price Range */}
      <FilterSection title={`Price: $${priceRange[0]} - $${priceRange[1]}`}>
        <div className="px-1 pt-3 pb-1">
          <Slider
            value={priceRange}
            onValueChange={handlePriceChange}
            max={300}
            step={5}
            className="w-full"
          />
          <div className="flex justify-between mt-3 text-xs text-slate-500 dark:text-slate-400">
            <span>$0</span>
            <span>$300</span>
          </div>
        </div>
      </FilterSection>

      {/* Categories */}
      <FilterSection title="Categories">
        <div className="space-y-3">
          {CATEGORIES.map((category) => (
            <label
              key={category}
              className="flex items-start space-x-3 cursor-pointer group py-0.5"
            >
              <Checkbox
                id={category}
                checked={selectedCategories.includes(category)}
                onCheckedChange={() => toggleCategory(category)}
                className="mt-0.5 h-5 w-5 rounded-md border-2 data-[state=checked]:bg-slate-900 data-[state=checked]:border-slate-900 dark:data-[state=checked]:bg-slate-100 dark:data-[state=checked]:border-slate-100"
              />
              <span className="text-[15px] leading-relaxed text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors">
                {category}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Condition */}
      <FilterSection title="Condition">
        <div className="space-y-3">
          {CONDITIONS.map((condition) => (
            <label
              key={condition}
              className="flex items-center space-x-3 cursor-pointer group py-0.5"
            >
              <Checkbox
                id={condition}
                checked={selectedConditions.includes(condition)}
                onCheckedChange={() => toggleCondition(condition)}
                className="h-5 w-5 rounded-md border-2 data-[state=checked]:bg-slate-900 data-[state=checked]:border-slate-900 dark:data-[state=checked]:bg-slate-100 dark:data-[state=checked]:border-slate-100"
              />
              <span className="text-[15px] text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors">
                {condition}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Clear Filters */}
      {activeFiltersCount > 0 && (
        <div className="pt-2">
          <Button
            variant="outline"
            onClick={clearAllFilters}
            className="w-full h-11 rounded-lg border-2 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-400 dark:hover:border-slate-600 transition-all text-base font-medium"
          >
            <X className="w-4 h-4 mr-2" />
            Clear All Filters ({activeFiltersCount})
          </Button>
        </div>
      )}
    </div>
  );

  const activeFilters = useMemo(() => [
    ...selectedCategories.map(cat => ({ type: 'category', value: cat })),
    ...selectedConditions.map(cond => ({ type: 'condition', value: cond }))
  ], [selectedCategories, selectedConditions]);

  return (
    <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center">
          {/* Search Input */}
          <div className="relative flex flex-1 gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 w-5 h-5 pointer-events-none" />
              <Input
                placeholder="Search by title, author, ISBN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearchChange(searchQuery);
                  }
                }}
                className="pl-12 pr-10 h-11 sm:h-12 text-base bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-600 focus:border-transparent transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    handleSearchChange("");
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-all"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <Button
              onClick={() => handleSearchChange(searchQuery)}
              className="h-11 sm:h-12 px-5 sm:px-6 rounded-xl bg-gradient-to-r from-[#C46A4A] to-[#A85738] hover:from-[#B05939] hover:to-[#8F4729] text-white font-semibold shadow-lg shadow-[#C46A4A]/30 transition-all"
            >
              <Search className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Search</span>
            </Button>
          </div>

          {/* Filter Sheet Trigger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                className="relative h-11 sm:h-12 px-5 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 hover:border-slate-300 dark:hover:border-slate-600 transition-all text-base font-medium gap-2.5 min-w-[120px] sm:min-w-[140px]"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span className="hidden sm:inline">Filters</span>
                <span className="sm:hidden">Filter</span>
                {activeFiltersCount > 0 && (
                  <Badge
                    variant="default"
                    className="ml-1 px-2 h-6 text-xs font-semibold bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-full"
                  >
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-full sm:w-[420px] p-0 overflow-hidden flex flex-col border-l-2 border-slate-200 dark:border-slate-800"
            >
              <SheetHeader className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                <SheetTitle className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                  Filter Books
                </SheetTitle>
                {activeFiltersCount > 0 && (
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    {activeFiltersCount} {activeFiltersCount === 1 ? 'filter' : 'filters'} active
                  </p>
                )}
              </SheetHeader>
              <div className="flex-1 overflow-y-auto px-6 py-6">
                <FilterContent />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Active Filters Pills */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4 animate-in fade-in-50 slide-in-from-top-2 duration-300">
            {activeFilters.map((filter) => (
              <Badge
                key={`${filter.type}-${filter.value}`}
                variant="secondary"
                className="pl-3 pr-2 py-1.5 gap-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700 text-sm font-medium"
              >
                <span>{filter.value}</span>
                <button
                  onClick={() => {
                    if (filter.type === 'category') {
                      toggleCategory(filter.value);
                    } else {
                      toggleCondition(filter.value);
                    }
                  }}
                  className="rounded-full hover:bg-slate-300 dark:hover:bg-slate-600 p-0.5 transition-colors"
                  aria-label={`Remove ${filter.value} filter`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}