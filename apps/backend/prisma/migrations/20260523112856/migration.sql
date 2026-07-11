-- DropForeignKey
ALTER TABLE "header_menu_translations" DROP CONSTRAINT "header_menu_translations_menu_id_fkey";

-- DropForeignKey
ALTER TABLE "header_menus" DROP CONSTRAINT "header_menus_parent_id_fkey";

-- AddForeignKey
ALTER TABLE "header_menus" ADD CONSTRAINT "header_menus_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "header_menus"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "header_menu_translations" ADD CONSTRAINT "header_menu_translations_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "header_menus"("id") ON DELETE CASCADE ON UPDATE CASCADE;
