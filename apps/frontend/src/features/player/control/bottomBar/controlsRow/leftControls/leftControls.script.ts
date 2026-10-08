"use client";

import { useEffect, useState } from "react";

export function useOpenControl() {
  const [openControl, setOpenControl] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const handler = (e: MediaQueryListEvent) => {
      if (e.matches) setOpenControl(false);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return { openControl, setOpenControl };
}
