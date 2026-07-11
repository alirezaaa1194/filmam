import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateHeaderMenuDto,
  DeleteHeaderMenuDto,
  GetAllHeaderMenusAdminDto,
  GetAllHeaderMenusPublicDto,
} from './dto/header-menu.dto';
import { prisma } from '../lib/prisma';
import { HeaderMenuRepository } from './repository/header-menu.repository';
import { HeaderMenuTranslationService } from '../header-menu-translation/header-menu-translation.service';
import { HeaderMenuType } from '../generated/prisma';
import { HeaderMenuFilterService } from '../header-menu-filter/header-menu-filter.service';
import { defaultLang, paginationCalculator } from '../lib/utils';
import { SortType } from '../common/enums';

@Injectable()
export class HeaderMenuService {
  constructor(
    private readonly headerMenuRepository: HeaderMenuRepository,
    private readonly headerMenuTranslationService: HeaderMenuTranslationService,
    private readonly headerMenuFilterService: HeaderMenuFilterService,
  ) {}
  async createHeaderMenu(body: CreateHeaderMenuDto) {
    if (body.menu_type === HeaderMenuType.FILTER && !body.filters?.length) {
      throw new BadRequestException('Filters array should be least one item');
    } else if (body.menu_type === HeaderMenuType.PAGE && body.filters?.length) {
      throw new BadRequestException('Page type menu can not take filter');
    } else if (body.menu_type === HeaderMenuType.PAGE && !body.href) {
      throw new BadRequestException('Page type menu must take href');
    }

    const result = await prisma.$transaction(async (tx) => {
      const createdHeaderMenu =
        await this.headerMenuRepository.createHeaderMenu(body, tx);

      if (
        body.menu_type === HeaderMenuType.FILTER &&
        body.filters &&
        body.filters.length
      ) {
        await this.headerMenuFilterService.createHeaderMenuFilter(
          body.filters,
          createdHeaderMenu.id,
          tx,
        );
      }

      return await this.headerMenuTranslationService.createHeaderMenuTranslation(
        body.translations,
        createdHeaderMenu.id,
        tx,
      );
    });

    return result;
  }

  async updateHeaderMenu(menuId: number, body: CreateHeaderMenuDto) {
    if (body.menu_type === HeaderMenuType.FILTER && !body.filters?.length) {
      throw new BadRequestException('Filters array should be least one item');
    } else if (body.menu_type === HeaderMenuType.PAGE && body.filters?.length) {
      throw new BadRequestException('Page type menu can not take filter');
    } else if (body.menu_type === HeaderMenuType.PAGE && !body.href) {
      throw new BadRequestException('Page type menu must take href');
    }

    const result = await prisma.$transaction(async (tx) => {
      await this.headerMenuRepository.updateHeaderMenu(menuId, body, tx);

      if (
        body.menu_type === HeaderMenuType.FILTER &&
        body.filters &&
        body.filters.length
      ) {
        await this.headerMenuFilterService.updateHeaderMenuFilter(
          menuId,
          body.filters,
          tx,
        );
      }

      return await this.headerMenuTranslationService.updateHeaderMenuTranslation(
        menuId,
        body.translations,
        tx,
      );
    });

    return result;
  }

  async deleteHeaderMenus(body: DeleteHeaderMenuDto) {
    const result = await prisma.$transaction(async (tx) => {
      return await this.headerMenuRepository.deleteHeaderMenus(
        body.menu_ids,
        tx,
      );
    });

    return result;
  }

  async getAllHeaderMenusAdmin(query: GetAllHeaderMenusAdminDto) {
    const { page, page_size } = paginationCalculator(
      query.page || 1,
      query.page_size || 10,
    );

    const headerMenus = await this.headerMenuRepository.getAllHeaderMenusAdmin({
      page,
      page_size,
      search: query.search?.trim() ?? '',
      sort_type: query.sort === SortType.ASC ? 'asc' : 'desc',
      lang: query.lang || defaultLang,
    });

    const normalizedHeaderMenus = headerMenus.map((headerMenu) => {
      const { translations, ...otherHeaderMenuData } = headerMenu;
      return { ...otherHeaderMenuData, title: translations[0].title };
    });

    const headerMenusCount =
      await this.headerMenuRepository.getAllHeaderMenusCount(
        query.search?.trim(),
      );
    return {
      page: page + 1,
      page_size: page_size,
      count: headerMenusCount,
      data: normalizedHeaderMenus,
    };
  }

  async getAllHeaderMenusPublic(query: GetAllHeaderMenusPublicDto) {
    const headerMenus = await this.headerMenuRepository.getAllHeaderMenusPublic(
      query.lang || defaultLang,
    );

    const normalizedHeaderMenus = headerMenus.map((headerMenu) => {
      const { translations, children, filters, ...otherHeaderMenuData } =
        headerMenu;

      const headerSubMenuData = children.map((child) => {
        const { translations, filters, ...otherHeaderSubMenuData } = child;

        return {
          ...otherHeaderSubMenuData,
          title: translations[0].title,
          filter:
            child.menu_type === HeaderMenuType.FILTER
              ? `${[
                  ...filters,
                  { filter_key: 'lang', filter_value: query.lang },
                  { filter_key: 'page', filter_value: 1 },
                  { filter_key: 'page_size', filter_value: 20 },
                ]
                  .map(
                    (sf, i) =>
                      `${i === 0 ? '?' : '&'}${sf.filter_key.toLowerCase()}=${sf.filter_value}`,
                  )
                  .join('')}`
              : null,
        };
      });

      return {
        ...otherHeaderMenuData,
        title: translations[0].title,
        filter:
          headerMenu.menu_type === HeaderMenuType.FILTER
            ? `${[
                ...filters,
                { filter_key: 'lang', filter_value: query.lang },
                { filter_key: 'page', filter_value: 1 },
                { filter_key: 'page_size', filter_value: 20 },
              ]
                .map(
                  (sf, i) =>
                    `${i === 0 ? '?' : '&'}${sf.filter_key.toLowerCase()}=${sf.filter_value}`,
                )
                .join('')}`
            : null,
        children: headerSubMenuData,
      };
    });

    return normalizedHeaderMenus;
  }

  async getHeaderMenuDetail(menuId: number) {
    const headerMenuItem =
      await this.headerMenuRepository.getHeaderMenuDetail(menuId);

    if (!headerMenuItem) {
      throw new NotFoundException('Item was not found');
    }

    return headerMenuItem;
  }
}
