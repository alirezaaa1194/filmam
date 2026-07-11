import { Injectable } from '@nestjs/common';
import { TransactionType } from '../../common/types/types';
import { CreateHeaderMenuFilterRepositoryType } from '../type/header-menu-filter.type';

@Injectable()
export class HeaderMenuFilterRepository {
  async createHeaderMenuFilters(
    body: CreateHeaderMenuFilterRepositoryType[],
    tx: TransactionType,
  ) {
    return await tx.headerMenuFilter.createMany({
      data: body,
    });
  }
  async deleteHeaderMenuFilters(menuId: number, tx: TransactionType) {
    return await tx.headerMenuFilter.deleteMany({
      where: { menu_id: menuId },
    });
  }
}
