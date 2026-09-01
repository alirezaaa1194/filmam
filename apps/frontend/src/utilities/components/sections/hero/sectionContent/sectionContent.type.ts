import { StaticImageData } from "next/image";

export type HeroSectionContentPropsType = {
  title: string;
  description: string;
  options: string[];
  imageUrl: string | StaticImageData;
};
