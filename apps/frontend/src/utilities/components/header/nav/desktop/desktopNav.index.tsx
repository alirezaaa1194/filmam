import { MenuItemType } from "@/types";
import DesktopNavItem from "./desktopNavItem/desktopNavItem.index";

async function DesktopNav({ menuData }: { menuData: MenuItemType[] }) {
  return (
    <div className="hidden lg:flex items-center gap-8">
      {menuData.map((menuItem) => (
        <DesktopNavItem key={menuItem.id} menuItem={menuItem} />
      ))}
    </div>
  );
}

export default DesktopNav;
