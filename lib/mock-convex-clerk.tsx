"use client";

import React from "react";

export const ConvexProviderWithClerk = ({
  children,
}: {
  children: React.ReactNode;
  client?: any;
  useAuth?: any;
}) => {
  return <>{children}</>;
};
