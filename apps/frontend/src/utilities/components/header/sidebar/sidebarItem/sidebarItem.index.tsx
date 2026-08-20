import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { MenuItemType, MenuTypeEnum } from "@/types";
import { ArrowDown2 } from "iconsax-react";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

function SidebarItem({ menuItem }: { menuItem: MenuItemType }) {
  return (
    <Accordion key={menuItem.id} type="single" collapsible>
      <AccordionItem value={`${menuItem.id}`}>
        <AccordionTrigger showIcon={false} className="py-2 cursor-pointer group">
          <span className="flex items-center gap-2 text-body-xs">
            {menuItem.title} <ArrowDown2 className="size-5 stroke-white transition-all group-data-[state=open]:rotate-180" />
          </span>
        </AccordionTrigger>
        <AccordionContent className="px-3">
          {menuItem.children.map((menuItemChild, j) => (
            <>
              <Link key={menuItemChild.id} href={menuItemChild.menu_type === MenuTypeEnum.PAGE ? `${menuItemChild.href}` : `/movies${menuItemChild.filter}`} className="block py-2 last:py-0">
                {menuItemChild.title}
              </Link>
              {j + 1 !== menuItem.children.length ? <Separator className="bg-gray-12" /> : null}
            </>
          ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export default SidebarItem;
