"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { API_BASE_URL, cn } from "@/lib/utils";
import { SearchResult } from "@/lib/search";
import Image from "next/image";

interface SearchBarProps {
  className?: string;
}

const BACKEND_URL = API_BASE_URL

export function SearchBar({ className }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [error, setError] = useState<string | null>(null);

  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.length >= 2) {
        fetchSuggestions(query);
      } else {
        setSuggestions([]);
        setIsOpen(false);
        setError(null);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchSuggestions = async (searchQuery: string) => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${BACKEND_URL}/search/suggest?q=${encodeURIComponent(searchQuery)}`,
        { signal: abortControllerRef.current.signal }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Search failed");
      }

      const data = await response.json();

      setSuggestions(data.results);
      setIsOpen(data.results.length > 0);
      setSelectedIndex(-1);
    } catch (err: any) {
      if (err.name !== "AbortError") {
        console.error("Search failed:", err);
        setError(err.message);
        setSuggestions([]);
        setIsOpen(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0) handleSelect(suggestions[selectedIndex]);
        break;
      case "Escape":
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleSelect = (result: SearchResult) => {
    setQuery(result.name);
    setIsOpen(false);
    setSelectedIndex(-1);

    const url = result.type === "stall" ? `/stalls/${result.id}` : `/items/${result.id}`;
    router.push(url);
  };

  const formatPrice = (price?: number | null) =>
  typeof price === "number" ? `₱${price.toFixed(2)}` : "";

  return (
    <div ref={searchRef} className={cn("relative w-full", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setIsOpen(true)}
          placeholder="Search vendors or products..."
          className="pl-10 pr-10"
        />
        {isLoading && (
          <div className="absolute right-10 top-1/2 -translate-y-1/2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        )}
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setSuggestions([]);
              setIsOpen(false);
              setError(null);
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {error && query.length >= 2 && (
        <div className="absolute top-full z-50 mt-2 w-full rounded-lg border bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {isOpen && !error && (
        <div className="absolute top-full z-50 mt-2 w-full rounded-lg border bg-popover shadow-lg">
          <div className="max-h-[400px] overflow-y-auto p-1">
            {suggestions.map((item, index) => (
              <button
                key={`${item.type}-${item.id}`}
                onClick={() => handleSelect(item)}
                onMouseEnter={() => setSelectedIndex(index)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-md p-3 text-left transition-colors",
                  index === selectedIndex
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-accent/50"
                )}
              >
                {item.imageUrl ? (
                  <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                ) : (
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-md bg-muted text-2xl">
                    {item.type === "stall" ? "🏪" : "🛍️"}
                  </div>
                )}

                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-medium text-sm">{item.name}</p>
                  </div>

                  {item.type === "item" && (
                    <>
                      {item.price && (
                        <p className="text-sm font-semibold text-primary">
                          {formatPrice(item.price)}
                        </p>
                      )}
                      {item.stallName && (
                        <p className="truncate text-xs text-muted-foreground">
                          from {item.stallName}
                        </p>
                      )}
                    </>
                  )}

                  {item.type === "stall" && item.category && (
                    <p className="text-xs text-muted-foreground">{item.category}</p>
                  )}
                </div>

                <div className="text-xl flex-shrink-0">
                  {item.type === "stall" ? "🏪" : "🛍️"}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
