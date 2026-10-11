"use client";

import React, { createContext, useContext, useState } from "react";
import { useRouter } from "next/navigation";

export interface MockUser {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  imageUrl: string;
  emailAddresses: Array<{ emailAddress: string }>;
}

const defaultUser: MockUser = {
  id: "user_jotion_mock",
  firstName: "Lucas",
  lastName: "Pasquetti",
  fullName: "Lucas Pasquetti",
  imageUrl: "/logo.svg",
  emailAddresses: [{ emailAddress: "lucascunhapasquetti@gmail.com" }],
};

interface ClerkContextType {
  isSignedIn: boolean;
  user: MockUser | null;
  signIn: () => void;
  signOut: () => void;
}

const ClerkContext = createContext<ClerkContextType>({
  isSignedIn: true,
  user: defaultUser,
  signIn: () => {},
  signOut: () => {},
});

export const ClerkProvider = ({
  children,
  publishableKey: _publishableKey,
}: {
  children: React.ReactNode;
  publishableKey?: string;
}) => {
  const [isSignedIn, setIsSignedIn] = useState(true);

  return (
    <ClerkContext.Provider
      value={{
        isSignedIn,
        user: isSignedIn ? defaultUser : null,
        signIn: () => setIsSignedIn(true),
        signOut: () => setIsSignedIn(false),
      }}
    >
      {children}
    </ClerkContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(ClerkContext);
  return {
    isLoaded: true,
    isSignedIn: context.isSignedIn,
    user: context.user,
  };
};

export const useAuth = () => {
  const context = useContext(ClerkContext);
  return {
    isLoaded: true,
    isSignedIn: context.isSignedIn,
    userId: context.isSignedIn ? defaultUser.id : null,
    sessionId: context.isSignedIn ? "sess_mock" : null,
    getToken: async () => (context.isSignedIn ? "mock_token" : null),
    signOut: async () => context.signOut(),
  };
};

export const SignInButton = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement> & {
    children?: React.ReactNode;
    mode?: string;
    asChild?: boolean;
  }
>(({ children, onClick, mode: _mode, asChild: _asChild, ...props }, ref) => {
  const { signIn } = useContext(ClerkContext);
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLSpanElement>) => {
    signIn();
    if (onClick) {
      onClick(e);
    }
    router.push("/documents");
  };

  return (
    <span
      ref={ref}
      onClick={handleClick}
      {...props}
      className={props.className || "inline-block cursor-pointer"}
    >
      {children}
    </span>
  );
});
SignInButton.displayName = "SignInButton";

export const SignOutButton = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement> & {
    children?: React.ReactNode;
    signOutCallback?: () => void;
  }
>(({ children, onClick, ...props }, ref) => {
  const { signOut } = useContext(ClerkContext);
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLSpanElement>) => {
    signOut();
    if (onClick) {
      onClick(e);
    }
    router.push("/");
  };

  return (
    <span
      ref={ref}
      onClick={handleClick}
      {...props}
      className={props.className || "inline-block w-full cursor-pointer"}
    >
      {children}
    </span>
  );
});
SignOutButton.displayName = "SignOutButton";

export const UserButton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    afterSignOutUrl?: string;
  }
>(({ afterSignOutUrl, onClick, ...props }, ref) => {
  const router = useRouter();
  const { user } = useUser();

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (onClick) {
      onClick(e);
    }
    router.push(afterSignOutUrl || "/");
  };

  return (
    <div
      ref={ref}
      role="button"
      onClick={handleClick}
      {...props}
      className={
        props.className ||
        "h-8 w-8 rounded-full border border-border flex items-center justify-center bg-secondary hover:opacity-80 transition cursor-pointer overflow-hidden p-0.5"
      }
      title={user?.fullName || "Account"}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={user?.imageUrl || "/logo.svg"}
        alt="User Avatar"
        className="h-full w-full rounded-full object-cover"
      />
    </div>
  );
});
UserButton.displayName = "UserButton";
