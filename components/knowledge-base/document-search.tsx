"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";

export function DocumentSearch({ initialValue }: { initialValue?: string }) {
  const [value, setValue] = useState(initialValue ?? "");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      if (value) {
        params.set("search", value);
      } else {
        params.delete("search");
      }
      params.delete("page"); // nowe wyszukiwanie zawsze wraca na stronę 1

      router.replace(`/knowledge-base?${params.toString()}`, { scroll: false });
    }, 300);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <Input
      type="search"
      placeholder="Szukaj po tytule..."
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className="max-w-sm"
    />
  );
}