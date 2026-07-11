-- CreateEnum
CREATE TYPE "HeaderMenuType" AS ENUM ('PAGE', 'FILTER');

-- AlterTable
ALTER TABLE "section_filters" ADD COLUMN     "headerMenuId" INTEGER;

-- CreateTable
CREATE TABLE "header_menus" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "menu_type" "HeaderMenuType" NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "header_menus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "header_menu_translations" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "language" "AppLanguage" NOT NULL,
    "title" TEXT NOT NULL,
    "menu_id" INTEGER NOT NULL,

    CONSTRAINT "header_menu_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "header_menu_filters" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "filter_key" "SectionFilterKey" NOT NULL,
    "filter_value" TEXT NOT NULL,
    "menu_id" INTEGER NOT NULL,

    CONSTRAINT "header_menu_filters_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "section_filters" ADD CONSTRAINT "section_filters_headerMenuId_fkey" FOREIGN KEY ("headerMenuId") REFERENCES "header_menus"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "header_menu_translations" ADD CONSTRAINT "header_menu_translations_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "header_menus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "header_menu_filters" ADD CONSTRAINT "header_menu_filters_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "header_menus"("id") ON DELETE CASCADE ON UPDATE CASCADE;
