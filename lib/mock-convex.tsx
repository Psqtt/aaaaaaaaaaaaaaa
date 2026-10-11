"use client";

import React, { useCallback, useSyncExternalStore } from "react";
import type {
  FunctionReference,
  OptionalRestArgs,
  FunctionReturnType,
} from "convex/server";
import { getFunctionName } from "convex/server";

type OptionalRestArgsOrSkip<Func extends FunctionReference<any>> =
  | OptionalRestArgs<Func>
  | ["skip"];

export interface DocumentItem {
  _id: string;
  _creationTime: number;
  title: string;
  userId: string;
  isArchived: boolean;
  parentDocument?: string;
  content?: string;
  coverImage?: string;
  icon?: string;
  isPublished: boolean;
}

const STORAGE_KEY = "nexus_documents_store";

const initialDocuments: DocumentItem[] = [
  {
    _id: "doc_welcome",
    _creationTime: 1700000000000,
    title: "Getting Started with Nexus",
    userId: "user_jotion_mock",
    isArchived: false,
    icon: "👋",
    content: JSON.stringify([
      {
        id: "block-1",
        type: "heading",
        props: {
          textColor: "default",
          backgroundColor: "default",
          textAlignment: "left",
          level: 1,
        },
        content: [{ type: "text", text: "Welcome to Nexus!", styles: {} }],
        children: [],
      },
      {
        id: "block-2",
        type: "paragraph",
        props: {
          textColor: "default",
          backgroundColor: "default",
          textAlignment: "left",
        },
        content: [
          {
            type: "text",
            text: "This is your all-in-one workspace. Take notes, organize documents, upload cover photos, and customize icons.",
            styles: {},
          },
        ],
        children: [],
      },
      {
        id: "block-3",
        type: "bulletListItem",
        props: {
          textColor: "default",
          backgroundColor: "default",
          textAlignment: "left",
        },
        content: [
          {
            type: "text",
            text: "Create sub-pages and organize notes hierarchically",
            styles: {},
          },
        ],
        children: [],
      },
      {
        id: "block-4",
        type: "bulletListItem",
        props: {
          textColor: "default",
          backgroundColor: "default",
          textAlignment: "left",
        },
        content: [
          {
            type: "text",
            text: "Search documents instantly via search modal",
            styles: {},
          },
        ],
        children: [],
      },
    ]),
    isPublished: false,
  },
  {
    _id: "doc_notes",
    _creationTime: 1700000100000,
    title: "Quick Notes & Project Ideas",
    userId: "user_jotion_mock",
    isArchived: false,
    icon: "💡",
    content: JSON.stringify([
      {
        id: "block-quick-1",
        type: "paragraph",
        props: {
          textColor: "default",
          backgroundColor: "default",
          textAlignment: "left",
        },
        content: [
          {
            type: "text",
            text: "Jot down your daily thoughts and brainstorming ideas here.",
            styles: {},
          },
        ],
        children: [],
      },
    ]),
    isPublished: false,
  },
];

let memoryDocuments: DocumentItem[] = [...initialDocuments];
let isInitialized = false;
let storeVersion = 0;

const listeners = new Set<() => void>();
const queryCache = new Map<string, { version: number; result: any }>();
const serverQueryCache = new Map<string, any>();

function notify() {
  listeners.forEach((listener) => {
    listener();
  });
}

function getStoredDocuments(): DocumentItem[] {
  if (typeof window === "undefined") {
    return memoryDocuments;
  }
  if (!isInitialized) {
    isInitialized = true;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          memoryDocuments = parsed;
          storeVersion++;
        }
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(memoryDocuments));
      }
    } catch {
      // Ignore localStorage errors
    }
  }
  return memoryDocuments;
}

function saveDocuments(docs: DocumentItem[]) {
  storeVersion++;
  memoryDocuments = docs;
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
    } catch {
      // Ignore
    }
  }
  notify();
}

export class ConvexReactClient {
  constructor(_url?: string, _options?: any) {}
  setAuth() {}
  clearAuth() {}
}

export const ConvexProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <>{children}</>;
};

export const useConvexAuth = () => {
  return {
    isLoading: false,
    isAuthenticated: true,
  };
};

function extractFunctionName(fnRef: any): string {
  if (typeof fnRef === "string") return fnRef;
  try {
    const name = getFunctionName(fnRef);
    if (typeof name === "string") return name;
  } catch {
    // Ignore error and fall back
  }
  if (fnRef?._name && typeof fnRef._name === "string") return fnRef._name;
  return String(fnRef || "");
}

export function invalidateQueryCache() {
  storeVersion++;
  notify();
}

function computeQueryResult(fnName: string, args: any, docs: DocumentItem[]): any {
  const userId = "user_jotion_mock";

  if (fnName.includes("getSidebar")) {
    const parent = args?.parentDocument;
    const sortMode =
      typeof window !== "undefined"
        ? localStorage.getItem("nexus_sidebar_sort") || "recent"
        : "recent";
    const filtered = docs.filter(
      (d) =>
        d.userId === userId &&
        !d.isArchived &&
        d.parentDocument === (parent || undefined)
    );
    if (sortMode === "alpha") {
      return filtered.sort((a, b) =>
        (a.title || "").localeCompare(b.title || "")
      );
    } else if (sortMode === "created_asc") {
      return filtered.sort((a, b) => a._creationTime - b._creationTime);
    }
    return filtered.sort((a, b) => b._creationTime - a._creationTime);
  }

  if (fnName.includes("getById")) {
    if (!args?.documentId) return undefined;
    const doc = docs.find((d) => d._id === args.documentId);
    return doc || null;
  }

  if (fnName.includes("getTrash")) {
    return docs
      .filter((d) => d.userId === userId && d.isArchived)
      .sort((a, b) => b._creationTime - a._creationTime);
  }

  if (fnName.includes("getSearch")) {
    return docs
      .filter((d) => d.userId === userId && !d.isArchived)
      .sort((a, b) => b._creationTime - a._creationTime);
  }

  return undefined;
}

function getCachedQueryResult(fnName: string, argsKey: string, args: any): any {
  const cacheKey = `${fnName}:${argsKey}`;
  const cached = queryCache.get(cacheKey);
  if (cached && cached.version === storeVersion) {
    return cached.result;
  }
  const docs = getStoredDocuments();
  const result = computeQueryResult(fnName, args, docs);
  queryCache.set(cacheKey, { version: storeVersion, result });
  return result;
}

function getCachedServerQueryResult(fnName: string, argsKey: string, args: any): any {
  const cacheKey = `${fnName}:${argsKey}`;
  if (serverQueryCache.has(cacheKey)) {
    return serverQueryCache.get(cacheKey);
  }
  const result = computeQueryResult(fnName, args, memoryDocuments);
  serverQueryCache.set(cacheKey, result);
  return result;
}

export function useMutation<
  Mutation extends FunctionReference<"mutation">
>(
  mutationRef: Mutation
): (...args: OptionalRestArgs<Mutation>) => Promise<FunctionReturnType<Mutation>> {
  const fnName = extractFunctionName(mutationRef);

  return useCallback(
    async (...callArgs: any[]) => {
      const args = callArgs[0] || {};
      const docs = [...getStoredDocuments()];
      const userId = "user_jotion_mock";

      if (fnName.includes("create")) {
        const newId =
          "doc_" +
          Math.random().toString(36).substring(2, 9) +
          Date.now().toString(36);
        const newDoc: DocumentItem = {
          _id: newId,
          _creationTime: Date.now(),
          title: args?.title || "Untitled",
          parentDocument: args?.parentDocument,
          userId,
          isArchived: false,
          isPublished: false,
        };
        docs.unshift(newDoc);
        saveDocuments(docs);
        return newId as any;
      }

      if (fnName.includes("update")) {
        const index = docs.findIndex((d) => d._id === args.id);
        if (index !== -1) {
          const { id: _id, ...rest } = args;
          docs[index] = { ...docs[index], ...rest };
          saveDocuments(docs);
          return docs[index] as any;
        }
        return null as any;
      }

      if (fnName.includes("archive")) {
        const archiveRecursive = (docId: string) => {
          const children = docs.filter((d) => d.parentDocument === docId);
          for (const child of children) {
            child.isArchived = true;
            archiveRecursive(child._id);
          }
        };

        const target = docs.find((d) => d._id === args.id);
        if (target) {
          target.isArchived = true;
          archiveRecursive(target._id);
          saveDocuments(docs);
          return target as any;
        }
        return null as any;
      }

      if (fnName.includes("restore")) {
        const restoreRecursive = (docId: string) => {
          const children = docs.filter((d) => d.parentDocument === docId);
          for (const child of children) {
            child.isArchived = false;
            restoreRecursive(child._id);
          }
        };

        const target = docs.find((d) => d._id === args.id);
        if (target) {
          target.isArchived = false;
          if (target.parentDocument) {
            const parent = docs.find((d) => d._id === target.parentDocument);
            if (parent?.isArchived) {
              target.parentDocument = undefined;
            }
          }
          restoreRecursive(target._id);
          saveDocuments(docs);
          return target as any;
        }
        return null as any;
      }

      if (fnName.includes("removeIcon")) {
        const target = docs.find((d) => d._id === args.id);
        if (target) {
          target.icon = undefined;
          saveDocuments(docs);
          return target as any;
        }
        return null as any;
      }

      if (fnName.includes("removeCoverImage")) {
        const target = docs.find((d) => d._id === args.id);
        if (target) {
          target.coverImage = undefined;
          saveDocuments(docs);
          return target as any;
        }
        return null as any;
      }

      if (fnName.includes("remove")) {
        const filtered = docs.filter((d) => d._id !== args.id);
        saveDocuments(filtered);
        return { success: true } as any;
      }

      return null as any;
    },
    [fnName]
  );
}

export function useQuery<Query extends FunctionReference<"query">>(
  queryRef: Query,
  ...queryArgs: OptionalRestArgsOrSkip<Query>
): FunctionReturnType<Query> | undefined {
  const fnName = extractFunctionName(queryRef);
  const args = queryArgs[0] as any;
  const argsKey = JSON.stringify(args);

  const subscribe = useCallback((callback: () => void) => {
    listeners.add(callback);
    return () => {
      listeners.delete(callback);
    };
  }, []);

  const getSnapshot = useCallback(() => {
    return getCachedQueryResult(fnName, argsKey, args);
  }, [fnName, argsKey, args]);

  const getServerSnapshot = useCallback(() => {
    return getCachedServerQueryResult(fnName, argsKey, args);
  }, [fnName, argsKey, args]);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
