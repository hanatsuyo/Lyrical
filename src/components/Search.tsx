"use client";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";

export default function SearchBox() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery) {
      router.push(`/search?q=${encodeURIComponent(debouncedQuery)}`);
    }
  }, [debouncedQuery, router]);

  const handleBlur = () => {
    if (!query) {
      router.push("/dashboard");
    }
  };

  return (
    <div className="max-w-[180px]  md:max-w-[200px]">
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <div className="relative">
          <Search className="w-4 md:w-6  absolute -translate-y-1/2 top-1/2 left-2" />
          <input
            type="text"
            className="border pl-[28px] md:pl-[40px] pr-1 py-[9px] text-sm rounded-full"
            placeholder="音楽を検索"
            value={query}
            onFocus={() => router.push("/search")}
            onBlur={handleBlur}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </form>
    </div>
  );
}
