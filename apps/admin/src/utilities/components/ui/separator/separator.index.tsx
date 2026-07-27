import * as React from 'react'
import * as SeparatorPrimitive from '@radix-ui/react-separator'
import { Cn } from '@/scripts'

function Separator({
  className,
  orientation = 'horizontal',
  decorative = true,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      data-slot='separator'
      decorative={decorative}
      orientation={orientation}
      className={Cn(
        'shrink-0 bg-border data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-px',
        className
      )}
      {...props}
    />
  )
}

export { Separator }
