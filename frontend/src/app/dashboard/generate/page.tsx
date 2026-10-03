"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GeneratePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard/create");
  }, [router]);

  return (
    <div className="flex h-64 items-center justify-center">
      <div className="text-sm text-muted-foreground animate-pulse">
        Opening generator...
      </div>
    </div>
  );
}
