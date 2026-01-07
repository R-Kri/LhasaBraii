"use client";

import { useState } from "react";
import { Search, Filter, SlidersHorizontal, X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Slider } from "./ui/slider";
import { Checkbox } from "./ui/checkbox";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";

interface SearchAndFilterProps {
  onSearchChange?: (query: string) => void;
  onFiltersChange?: (filters: any) => void;
}

export function SearchAndFilter({ onSearchChange, onFiltersChange }: SearchAndFilterProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState([0, 300]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("relevance");

  const categories = [
    "Academic Textbooks",
    "Fiction & Literature",
    "Self-Help & Growth",
    "Business & Economics",
    "Science & Technology",
    "Children's Books"
  ];

  const conditions = ["New", "Like New", "Very Good", "Good", "Fair"];

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearchChange?.(value);
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategories = checked
      ? [...selectedCategories, category]
      : selectedCategories.filter(c => c !== category);
    setSelectedCategories(newCategories);

    onFiltersChange?.({
      categories: newCategories,
      conditions: selectedConditions,
      priceRange,
      sortBy
    });
  };

  const handleConditionChange = (condition: string, checked: boolean) => {
    const newConditions = checked
      ? [...selectedConditions, condition]
      : selectedConditions.filter(c => c !== condition);
    setSelectedConditions(newConditions);

    onFiltersChange?.({
      categories: selectedCategories,
      conditions: newConditions,
      priceRange,
      sortBy
    });
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedConditions([]);
    setPriceRange([0, 300]);
    setSortBy("relevance");
    onFiltersChange?.({
      categories: [],
      conditions: [],
      priceRange: [0, 300],
      sortBy: "relevance"
    });
  };

  const activeFiltersCount = selectedCategories.length + selectedConditions.length +
    (priceRange[0] > 0 || priceRange[1] < 300 ? 1 : 0);

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Sort */}
      <div>
        <label className="font-medium mb-3 block">Sort By</label>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="relevance">Relevance</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="rating">Highest Rated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Price Range */}
      <div>
        <label className="font-medium mb-3 block">
          Price Range: ${priceRange[0]} - ${priceRange[1]}
        </label>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          max={300}
          step={5}
          className="w-full"
        />
      </div>

      {/* Categories */}
      <div>
        <label className="font-medium mb-3 block">Categories</label>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={category}
                checked={selectedCategories.includes(category)}
                onCheckedChange={(checked) =>
                  handleCategoryChange(category, checked as boolean)
                }
              />
              <label htmlFor={category} className="text-sm cursor-pointer">
                {category}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Condition */}
      <div>
        <label className="font-medium mb-3 block">Condition</label>
        <div className="space-y-2">
          {conditions.map((condition) => (
            <div key={condition} className="flex items-center space-x-2">
              <Checkbox
                id={condition}
                checked={selectedConditions.includes(condition)}
                onCheckedChange={(checked) =>
                  handleConditionChange(condition, checked as boolean)
                }
              />
              <label htmlFor={condition} className="text-sm cursor-pointer">
                {condition}
              </label>
            </div>
          ))}
        </div>
      </div>

      {activeFiltersCount > 0 && (
        <Button variant="outline" onClick={clearFilters} className="w-full">
          Clear All Filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="bg-white border-b sticky top-16 z-40 py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          {/* Search Input */}
          <div className="relative flex-1 w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search by title, author, ISBN, or keyword..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 pr-4"
            />
          </div>

          {/* Filter Toggle for Mobile */}
          <div className="flex gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="relative">
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <Badge variant="destructive" className="ml-2 px-1 min-w-[20px] h-5">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <SheetTitle>Filter Books</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FilterContent />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Active Filters */}
        {(selectedCategories.length > 0 || selectedConditions.length > 0) && (
          <div className="flex flex-wrap gap-2 mt-4">
            {selectedCategories.map((category) => (
              <Badge key={category} variant="secondary" className="flex items-center gap-1">
                {category}
                <X
                  className="w-3 h-3 cursor-pointer"
                  onClick={() => handleCategoryChange(category, false)}
                />
              </Badge>
            ))}
            {selectedConditions.map((condition) => (
              <Badge key={condition} variant="secondary" className="flex items-center gap-1">
                {condition}
                <X
                  className="w-3 h-3 cursor-pointer"
                  onClick={() => handleConditionChange(condition, false)}
                />
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}