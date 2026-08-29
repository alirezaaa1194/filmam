"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react";

const Toaster = ({ ...props }: ToasterProps) => {
  useTheme();

  return (
    <Sonner
      theme="dark"
      className="toaster group font-sans!"
      icons={{
        success: <CircleCheckIcon className="size-5 text-success" />,
        info: <InfoIcon className="size-5 text-gray-8" />,
        warning: <TriangleAlertIcon className="size-5 text-warning" />,
        error: <OctagonXIcon className="size-5 text-error" />,
        loading: <Loader2Icon className="size-5 text-gray-8 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "#0c0c0c",
          "--normal-text": "#fdfdfd",
          "--normal-border": "#212121",
          "--success-bg": "#0c0c0c",
          "--success-text": "#fdfdfd",
          "--success-border": "#00966d",
          "--error-bg": "#0c0c0c",
          "--error-text": "#fdfdfd",
          "--error-border": "#c30000",
          "--warning-bg": "#0c0c0c",
          "--warning-text": "#fdfdfd",
          "--warning-border": "#e2b93b",
          "--info-bg": "#0c0c0c",
          "--info-text": "#fdfdfd",
          "--info-border": "#212121",
          "--border-radius": "0.75rem",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast text-body-xxs! font-normal! bg-black! text-white! border! border-gray-12! rounded-xl! shadow-none! p-4! gap-3! [&:has([data-type=success])]:border-success! [&:has([data-type=error])]:border-error! [&:has([data-type=warning])]:border-warning! [&:has([data-type=info])]:border-gray-12!",
          title: "text-body-xxs! font-normal! text-white! leading-1.8!",
          description: "text-body-xxs! font-normal! text-gray-9! leading-1.8!",
          content: "gap-2! w-full!",
          icon: "mt-0!",
          actionButton: "bg-primary! text-white! rounded-md! text-body-xxs! font-medium! h-8! px-3!",
          cancelButton: "bg-transparent! text-gray-9! rounded-md! text-body-xxs! font-medium! h-8! px-3! border! border-gray-12!",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
