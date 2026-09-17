import Image from "next/image";
import { PropsWithChildren } from "react";
import { HeroSectionContentPropsType } from "./sectionContent.type";

function HeroSectionContentComp({ title, description, options, imageUrl, children }: PropsWithChildren<HeroSectionContentPropsType>) {
  const placeholderPath = "/images/placeholder-h.jpg";

  return (
    <>
      <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(0deg,rgba(12,12,12,1)_0%,rgba(12,12,12,0.96)_13%,rgba(12,12,12,0.4)_33%,rgba(12,12,12,0)_47%,rgba(12,12,12,0.28)_68%,rgba(12,12,12,1)_100%)]" />
      <div className="absolute top-0 left-0 w-full h-full max-w-layout-max right-0 mx-auto flex flex-col justify-end gap-2 lg:gap-8 items-start px-layout-x-space py-8 lg:py-6">
        <div className="flex flex-col gap-2 md:max-w-[393px]">
          <h2 className="text-mobile-h-3 md:text-display-2">{title}</h2>
          <div className="hidden xl:flex flex-wrap gap-2">
            {options.map((option, i) => (
              <span key={i} className="flex items-center justify-center px-2 text-body-xs text-white border border-gray-10 bg-[#2f2f2f]/40 rounded-md">
                {option}
              </span>
            ))}
          </div>
          <p className="hidden md:block text-justify text-body-xs md:line-clamp-6!">{description}</p>
        </div>
        {children}
      </div>
      <Image src={imageUrl || placeholderPath} alt={title} className="w-full h-full object-cover object-top bg-gray-11" width={800} height={240} />
    </>
  );
}

export default HeroSectionContentComp;
