import { Injectable } from '@nestjs/common';
import { TransactionType } from '../../common/types/types';
import { CreateHeaderMenuDto } from '../dto/header-menu.dto';
import { prisma } from '../../lib/prisma';
import { AppLanguage } from '../../generated/prisma';
import { MenuType } from '../../common/enums';

@Injectable()
export class HeaderMenuRepository {
  async createHeaderMenu(body: CreateHeaderMenuDto, tx: TransactionType) {
    return await tx.headerMenu.create({
      data: {
        menu_type: body.menu_type,
        order: body.order,
        href: body.href,
        parent_id: body.parent_id,
      },
    });
  }

  async updateHeaderMenu(
    menuId: number,
    body: CreateHeaderMenuDto,
    tx: TransactionType,
  ) {
    return await tx.headerMenu.update({
      where: { id: menuId },
      data: {
        menu_type: body.menu_type,
        order: body.order,
        href: body.href,
        parent_id: body.parent_id,
      },
    });
  }

  async deleteHeaderMenus(menu_ids: number[], tx: TransactionType) {
    return await tx.headerMenu.deleteMany({
      where: {
        id: { in: menu_ids },
      },
    });
  }

  async getAllHeaderMenusAdmin2(query: {
    page: number;
    page_size: number;
    search: string;
    sort_type: 'asc' | 'desc';
    lang: AppLanguage;
    only_parents?: boolean;
  }) {
    return await prisma.headerMenu.findMany({
      skip: query.page,
      take: query.page_size,
      include: {
        translations: { where: { language: query.lang } },
        filters: true,
      },
      where: {
        ...(query.only_parents && { parent_id: null }),
        translations: {
          some: {
            title: {
              contains: query.search,
              mode: 'insensitive',
            },
          },
        },
      },
      orderBy: {
        created_at: query.sort_type,
      },
    });
  }
  async getAllHeaderMenusAdmin(query: {
    page: number;
    page_size: number;
    search: string;
    sort_type: 'asc' | 'desc';
    lang: AppLanguage;
    type?: MenuType;
  }) {
    return await prisma.headerMenu.findMany({
      skip: query.page,
      take: query.page_size,
      include: {
        translations: { where: { language: query.lang } },
        filters: true,
      },
      where: {
        ...(query.type
          ? { parent_id: query.type === 'CHILD' ? { not: null } : null }
          : {}),
        translations: {
          some: {
            title: {
              contains: query.search,
              mode: 'insensitive',
            },
          },
        },
      },
      orderBy: {
        created_at: query.sort_type,
      },
    });
  }

  async getAllHeaderMenusPublic(lang: AppLanguage) {
    return await prisma.headerMenu.findMany({
      where: { parent_id: null },
      include: {
        translations: { where: { language: lang } },
        filters: true,
        children: {
          include: {
            filters: true,
            translations: { where: { language: lang } },
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
      orderBy: {
        order: 'asc',
      },
    });
  }

  async getAllHeaderMenusCount(search: string = '') {
    return await prisma.headerMenu.count({
      where: {
        translations: {
          some: {
            title: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
      },
    });
  }

  async getHeaderMenuDetail(menuId: number) {
    return await prisma.headerMenu.findUnique({
      where: { id: menuId },
      include: {
        translations: true,
        filters: true,
        parent: {
          include: { translations: true },
        },
      },
    });
  }
}
