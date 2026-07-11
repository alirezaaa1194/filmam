import { Injectable } from '@nestjs/common';
import { TransactionType } from '../../common/types/types';
import { CreateHeaderMenuTranslationRepositoryType } from '../type/header-menu-translation.type';

@Injectable()
export class HeaderMenuTranslationRepository {
  async createHeaderMenuTranslations(
    body: CreateHeaderMenuTranslationRepositoryType[],
    tx: TransactionType,
  ) {
    return await tx.headerMenuTranslation.createMany({
      data: body,
    });
  }

  async deleteHeaderMenuTranslations(menuId: number, tx: TransactionType) {
    return await tx.headerMenuTranslation.deleteMany({
      where: { menu_id: menuId },
    });
  }
}
