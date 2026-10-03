"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProductDetailPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard/products");
  }, [router]);

  return (
    <div className="flex h-64 items-center justify-center">
      <div className="text-sm text-muted-foreground animate-pulse">
        Loading product details...
      </div>
    </div>
  );
}
