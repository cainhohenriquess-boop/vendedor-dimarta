"use client";

import { Toaster } from "sonner";

type ProvidersProps = {
  children: React.ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return (
    <>
      {children}
      <Toaster
        position="top-right"
        richColors
        expand
        toastOptions={{
          className: "border border-slate-200 shadow-lg",
        }}
      />
    </>
  );
}
