import type { ReactNode } from "react";

type ContactInfoCardProps = { icon: ReactNode; description: string; value: string; href?: string; className?: string; compactMobile?: boolean };

export default function ContactInfoCard({ icon, description, value, href, className = "", compactMobile = false }: ContactInfoCardProps) {
  const content = <>
    <span className={`${compactMobile ? "flex-row-reverse gap-6 lg:flex-col lg:gap-6" : "flex-col gap-6"} flex items-center`}>
      <span className={`${compactMobile ? "size-10 lg:size-16" : "size-12 lg:size-16"} flex shrink-0 items-center justify-center rounded-xl bg-primary-shade-7 [&>svg]:size-6 lg:[&>svg]:size-8`}>{icon}</span>
      <span className={`${compactMobile ? "min-h-0 flex-1 text-right lg:min-h-[76px] lg:flex-none lg:text-center" : "min-h-[76px] text-center"} text-body-xxs leading-7 text-gray-5 text-justify`}>{description}</span>
    </span>
    <span className={`${compactMobile ? "hidden lg:block" : "block"} text-h-5 font-bold text-gray-3`}>{value}</span>
  </>;
  const classNames = `flex ${compactMobile ? "min-h-[72px] flex-row-reverse gap-10 py-4 lg:min-h-[288px] lg:flex-col lg:py-6" : "min-h-[164px] flex-col gap-10 py-5 lg:min-h-[288px] lg:py-6"} items-center justify-between rounded-xl bg-gray-13 px-4 text-center ${className}`;
  return href ? <a href={href} className={classNames}>{content}</a> : <div className={classNames}>{content}</div>;
}
