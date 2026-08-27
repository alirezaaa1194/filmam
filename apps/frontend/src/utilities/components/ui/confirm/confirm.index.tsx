"use client"

import * as React from "react"
import { Dialog as DialogPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { Button } from "@/utilities/components/ui/button/button.index"
import { CloseCircle } from "iconsax-react"
import Image from "next/image"

function Confirm({ ...props }: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="Confirm" {...props} />
}

function ConfirmTrigger({ ...props }: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="Confirm-trigger" {...props} />
}

function ConfirmPortal({ ...props }: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="Confirm-portal" {...props} />
}

function ConfirmClose({ ...props }: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="Confirm-close" {...props} />
}

function ConfirmOverlay({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return <DialogPrimitive.Overlay data-slot="Confirm-overlay" className={cn("fixed inset-0 isolate z-50 bg-black/90 duration-100 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0", className)} {...props} />
}

function ConfirmContent({
  className,
  children,
  showCloseButton = true,
  showHeader = true,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean
  showHeader?: boolean
}) {
  return (
    <ConfirmPortal>
      <ConfirmOverlay />
      <DialogPrimitive.Content data-slot="Confirm-content" className={cn("fixed top-1/2 left-1/2 z-50 grid w-[90%] sm:max-w-[440px]! -translate-x-1/2 -translate-y-1/2 gap-0 rounded-xl bg-popover text-sm text-popover-foreground duration-100 outline-none sm:max-w-sm data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 bg-gray-13 lg:bg-gray-14 border border-gray-11 lg:border-gray-12 p-4 lg:p-0", className)} {...props}>
        {showHeader ? (
          <ConfirmHeader className="w-full hidden lg:flex flex-row items-center justify-between p-6 border-b border-b-gray-12">
            {showCloseButton && (
              <DialogPrimitive.Close data-slot="Confirm-close" asChild>
                <button className="cursor-pointer">
                  <CloseCircle className="size-6 fill-white" variant="Bold" />
                </button>
              </DialogPrimitive.Close>
            )}
            <div className="flex items-center gap-1">
              <Image src="/logo.svg" alt="filmam" width={32} height={32} className="size-6 lg:size-8" />
              <Image src="/logo-text.svg" alt="filmam" width={91} height={26} className="w-[68px] h-[20px] lg:w-[91px] lg:h-[26px]" />
            </div>
          </ConfirmHeader>
        ) : null}
        {children}
      </DialogPrimitive.Content>
    </ConfirmPortal>
  )
}

function ConfirmHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="Confirm-header" className={cn("flex flex-col gap-2", className)} {...props} />
}

function ConfirmFooter({
  className,
  showCloseButton = false,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  showCloseButton?: boolean
}) {
  return (
    <div data-slot="Confirm-footer" className={cn("-mx-4 -mb-4 flex flex-col-reverse gap-2 rounded-b-xl border-t bg-muted/50 p-4 sm:flex-row sm:justify-end", className)} {...props}>
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close asChild>
          <Button variant="outline">Close</Button>
        </DialogPrimitive.Close>
      )}
    </div>
  )
}

function ConfirmTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return <DialogPrimitive.Title data-slot="Confirm-title" className={cn("text-base leading-none font-medium", className)} {...props} />
}

function ConfirmDescription({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return <DialogPrimitive.Description data-slot="Confirm-description" className={cn("text-sm text-muted-foreground *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground", className)} {...props} />
}

export { Confirm, ConfirmClose, ConfirmContent, ConfirmDescription, ConfirmFooter, ConfirmHeader, ConfirmOverlay, ConfirmPortal, ConfirmTitle, ConfirmTrigger }
