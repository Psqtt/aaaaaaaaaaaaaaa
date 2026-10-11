"use client";

import React, { createContext, useContext } from "react";

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

const mockEdgeStore = {
  publicFiles: {
    upload: async ({
      file,
    }: {
      file: File;
      options?: { replaceTargetUrl?: string };
    }) => {
      const url = await fileToBase64(file);
      return { url };
    },
    delete: async (_opts: { url: string }) => {
      return { success: true };
    },
  },
};

type EdgeStoreContextType = {
  edgestore: typeof mockEdgeStore;
};

const EdgeStoreContext = createContext<EdgeStoreContextType>({
  edgestore: mockEdgeStore,
});

export const EdgeStoreProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return React.createElement(
    EdgeStoreContext.Provider,
    { value: { edgestore: mockEdgeStore } },
    children
  );
};

export const useEdgeStore = () => {
  return useContext(EdgeStoreContext);
};
