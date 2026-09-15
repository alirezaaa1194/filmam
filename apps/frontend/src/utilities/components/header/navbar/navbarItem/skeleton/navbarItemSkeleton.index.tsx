import { Skeleton } from "@/utilities/components/ui/skeleton/skeleton.index";

function NavbarItemSkeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <Skeleton className={className} {...props} />;
}

export default NavbarItemSkeleton;
