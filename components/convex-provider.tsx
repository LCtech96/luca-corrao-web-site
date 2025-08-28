"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";

// Get the Convex URL, with fallback for development
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "https://colorless-octopus-132.convex.cloud";

if (!convexUrl) {
  throw new Error("Missing NEXT_PUBLIC_CONVEX_URL environment variable");
}

const convex = new ConvexReactClient(convexUrl);

export function ConvexClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
