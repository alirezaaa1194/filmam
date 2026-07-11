import { Injectable } from '@nestjs/common';
import { HeaderMenuFilterRepository } from './repository/header-menu-filter.repository';
import { TransactionType } from '../common/types/types';
import { CreateHeaderMenuFilterServiceType } from './type/header-menu-filter.type';

@Injectable()
export class HeaderMenuFilterService {
  constructor(
    private readonly headerMenuFilterRepository: HeaderMenuFilterRepository,
  ) {}
  async createHeaderMenuFilter(
    body: CreateHeaderMenuFilterServiceType[],
    menuId: number,
    tx: TransactionType,
  ) {
    const headerMenuFiltersData = body.map((headerMenuFilter) => ({
      ...headerMenuFilter,
      menu_id: menuId,
    }));

    return await this.headerMenuFilterRepository.createHeaderMenuFilters(
      headerMenuFiltersData,
      tx,
    );
  }

  async deleteHeaderMenuFilters(menuId: number, tx: TransactionType) {
    return await this.headerMenuFilterRepository.deleteHeaderMenuFilters(
      menuId,
      tx,
    );
  }

  async updateHeaderMenuFilter(
    menuId: number,
    body: CreateHeaderMenuFilterServiceType[],
    tx: TransactionType,
  ) {
    await this.deleteHeaderMenuFilters(menuId, tx);
    return await this.createHeaderMenuFilter(body, menuId, tx);
  }
}
