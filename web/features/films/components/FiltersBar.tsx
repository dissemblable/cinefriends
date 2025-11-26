"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

const GENRES = [
  { id: "28", name: "Action" },
  { id: "12", name: "Adventure" },
  { id: "16", name: "Animation" },
  { id: "35", name: "Comedy" },
  { id: "80", name: "Crime" },
  { id: "99", name: "Documentary" },
  { id: "18", name: "Drama" },
  { id: "10751", name: "Family" },
  { id: "14", name: "Fantasy" },
  { id: "36", name: "History" },
  { id: "27", name: "Horror" },
  { id: "10402", name: "Music" },
  { id: "9648", name: "Mystery" },
  { id: "10749", name: "Romance" },
  { id: "878", name: "Science Fiction" },
  { id: "10770", name: "TV Movie" },
  { id: "53", name: "Thriller" },
  { id: "10752", name: "War" },
  { id: "37", name: "Western" },
];

const SORT_OPTIONS = [
  { value: "popularity.desc", label: "Popularity (High to Low)" },
  { value: "popularity.asc", label: "Popularity (Low to High)" },
  { value: "vote_average.desc", label: "Rating (High to Low)" },
  { value: "vote_average.asc", label: "Rating (Low to High)" },
  { value: "release_date.desc", label: "Release Date (Newest)" },
  { value: "release_date.asc", label: "Release Date (Oldest)" },
  { value: "title.asc", label: "Title (A-Z)" },
  { value: "title.desc", label: "Title (Z-A)" },
];

// Generate years from current year to 1900
const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: currentYear - 1899 }, (_, i) => ({
  value: (currentYear - i).toString(),
  label: (currentYear - i).toString(),
}));

export function FiltersBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentGenre = searchParams.get("genre") || "all";
  const currentYear = searchParams.get("year") || "all";
  const currentSort = searchParams.get("sort_by") || "popularity.desc";
  const currentQuery = searchParams.get("query") || "";

  const hasActiveFilters =
    currentGenre || currentYear || currentSort !== "popularity.desc";

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    // Reset to page 1 when changing filters
    params.delete("page");

    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    router.push(`/?${params.toString()}`);
  };

  const clearAllFilters = () => {
    const params = new URLSearchParams();

    // Keep the search query if it exists
    if (currentQuery) {
      params.set("query", currentQuery);
    }

    router.push(`/${params.toString() ? `?${params.toString()}` : ""}`);
  };

  // Don't show filters when searching
  if (currentQuery) {
    return null;
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2">
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="h-7 px-2 text-xs ml-auto"
          >
            <X className="h-3 w-3 mr-1" />
            Clear all
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Genre Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Genre
          </label>
          <Select
            value={currentGenre}
            onValueChange={(value) => updateFilter("genre", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All genres" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All genres</SelectItem>
              {GENRES.map((genre) => (
                <SelectItem key={genre.id} value={genre.id}>
                  {genre.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Year Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Release Year
          </label>
          <Select
            value={currentYear}
            onValueChange={(value) => updateFilter("year", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All years" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All years</SelectItem>
              {YEARS.map((year) => (
                <SelectItem key={year.value} value={year.value}>
                  {year.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sort Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Sort By
          </label>
          <Select
            value={currentSort}
            onValueChange={(value) => updateFilter("sort_by", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
