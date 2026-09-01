import { ArrowLeft } from "iconsax-react";
import Link from "next/link";

function SectionHeaderComp({ title, address }: { title: string; address: string }) {
  return (
    <div className="w-full flex items-center justify-between px-layout-x-space">
      <span className="text-white text-mobile-h-6 lg:text-h-5">{title}</span>
      <Link href={address} className="flex items-center gap-2 whitespace-nowrap text-gray-7 transition-all hover:text-primary hover:[&>svg]:fill-primary text-caption-md lg:text-body-xxs">
        مشاهده همه <ArrowLeft variant="Outline" className="fill-gray-7 size-5 transition-all" />
      </Link>
    </div>
  );
}

export default SectionHeaderComp;
