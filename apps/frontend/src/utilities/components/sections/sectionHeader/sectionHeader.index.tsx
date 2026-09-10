import { ArrowLeft } from "iconsax-react";
import Link from "next/link";
import { useLocale } from "../../../../hooks";

function SectionHeaderComp({ title, address, absolute }: { title: string; address: string; absolute?: boolean }) {
  const { dir } = useLocale();
  return (
    <div className={`w-full flex items-center justify-between px-layout-x-space ${absolute ? "lg:absolute z-10 lg:mt-10" : ""}`}>
      <h5 className="text-white text-mobile-h-6 lg:text-h-5">{title}</h5>
      <Link href={address} className="flex items-center gap-2 whitespace-nowrap text-gray-7 transition-all hover:text-primary active:text-primary hover:[&>svg]:fill-primary active:[&>svg]:fill-primary text-caption-md lg:text-body-xxs">
        مشاهده همه <ArrowLeft variant="Outline" className={`fill-gray-7 size-5 transition-all ${dir === "ltr" ? "rotate-180" : ""}`} />
      </Link>
    </div>
  );
}

export default SectionHeaderComp;
