import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/utilities/components/ui/accordion/accordion.index";
import { MenuItemType, MenuTypeEnum } from "@/types";
import { ArrowDown2 } from "iconsax-react";
import { Separator } from "@/utilities/components/ui/separator/separator.index";
import Link from "next/link";
import { Fragment } from "react/jsx-runtime";

function NavbarItem({ menuItem }: { menuItem: MenuItemType }) {
  return (
    <Accordion key={menuItem.id} type="single" collapsible>
      <AccordionItem value={`${menuItem.id}`}>
        <AccordionTrigger
          showIcon={false}
          className="py-2 cursor-pointer w-full group"
        >
          <span className="w-full flex items-center justify-between gap-2 text-body-xs">
            {menuItem.title}{" "}
            <ArrowDown2 className="size-5 stroke-white transition-all group-data-[state=open]:rotate-180" />
          </span>
        </AccordionTrigger>
        <AccordionContent className="px-3 pb-0">
          {menuItem.children.map((menuItemChild, j) => (
            <Fragment key={menuItemChild.id}>
              <Link
                href={
                  menuItemChild.menu_type === MenuTypeEnum.PAGE
                    ? `${menuItemChild.href}`
                    : `/movies${menuItemChild.filter}`
                }
                className="block py-2"
              >
                {menuItemChild.title}
              </Link>
              {j + 1 !== menuItem.children.length ? (
                <Separator className="bg-gray-12" />
              ) : null}
            </Fragment>
          ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export default NavbarItem;
