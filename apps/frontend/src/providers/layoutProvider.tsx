"use client";
import React from "react";

function LayoutProvider({ header, footer, children }: { header?: React.ReactNode; footer?: React.ReactNode; children: React.ReactNode }) {
  return (
    <>
      {header}
      {children}
      {footer}
    </>
  );
}

export default LayoutProvider;
