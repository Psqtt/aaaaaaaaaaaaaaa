"use client";

import { ReactNode } from "react";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";

const convex = new ConvexReactClient(
  process.env.NEXT_PUBLIC_CONVEX_URL || "https://mock.convex.cloud"
);

export const ConvexClientProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ClerkProvider
      publishableKey={
        process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
        "pk_test_bW9jay1jbGVyay1rZXktZm9yLWFpc3R1ZGlvLWJ1aWxkJA"
      }
    >
      <ConvexProviderWithClerk useAuth={useAuth as any} client={convex}>
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
};
