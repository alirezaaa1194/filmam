"use client";
import React from "react";
import { toast } from "sonner";

function LayoutProvider({ header, footer, children }: { header?: React.ReactNode; footer?: React.ReactNode; children: React.ReactNode }) {
  return (
    <>
      {header}
      {children}
      <button
        onClick={() => {
          toast.success("hello");
        }}
      >
        open
      </button>
      {footer}
    </>
  );
}

export default LayoutProvider;
