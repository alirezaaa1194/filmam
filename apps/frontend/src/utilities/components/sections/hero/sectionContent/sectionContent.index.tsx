import Image from "next/image";
import { PropsWithChildren } from "react";
import { HeroSectionContentPropsType } from "./sectionContent.type";

function HeroSectionContentComp({ title, description, options, imageUrl, children }: PropsWithChildren<HeroSectionContentPropsType>) {
  return (
    <>
      <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(0deg,rgba(0,0,0,1)_0%,rgba(12,12,13,0.96)_13%,rgba(13,12,15,0.4)_33%,rgba(13,12,15,0)_47%,rgba(13,12,15,0.28)_68%,rgba(12,12,12,1)_100%)] flex flex-col justify-end gap-2 lg:gap-8 items-start px-layout-x-space py-8 lg:py-6">
        <div className="flex flex-col gap-2 md:max-w-[393px]">
          <h2 className="text-mobile-h-3 md:text-display-2">{title}</h2>
          <div className="hidden lg:flex flex-wrap gap-2">
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
      <Image src={imageUrl} alt={title} className="w-full h-full object-cover" />
    </>
  );
}

export default HeroSectionContentComp;
