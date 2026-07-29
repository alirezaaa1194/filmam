import { Loader2Icon } from "lucide-react"
import { Cn } from "@/scripts"

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <Loader2Icon
      role="status"
      aria-label="Loading"
      className={Cn("size-4 animate-spin", className)}
      {...props}
    />
  )
}

export { Spinner }
