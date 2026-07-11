import { Injectable } from '@nestjs/common';
import { HeaderMenuTranslationRepository } from './repository/header-menu-translation.repository';
import { TransactionType } from '../common/types/types';
import { CreateHeaderMenuTranslationServiceType } from './type/header-menu-translation.type';

@Injectable()
export class HeaderMenuTranslationService {
  constructor(
    private readonly headerMenuTranslationRepository: HeaderMenuTranslationRepository,
  ) {}
  async createHeaderMenuTranslation(
    body: CreateHeaderMenuTranslationServiceType[],
    menuId: number,
    tx: TransactionType,
  ) {
    const headerMenuTranslationsData = body.map((headerMenuTranslation) => ({
      ...headerMenuTranslation,
      menu_id: menuId,
    }));

    return await this.headerMenuTranslationRepository.createHeaderMenuTranslations(
      headerMenuTranslationsData,
      tx,
    );
  }

  async deleteHeaderMenuTranslations(menuId: number, tx: TransactionType) {
    return await this.headerMenuTranslationRepository.deleteHeaderMenuTranslations(
      menuId,
      tx,
    );
  }

  async updateHeaderMenuTranslation(
    menuId: number,
    body: CreateHeaderMenuTranslationServiceType[],
    tx: TransactionType,
  ) {
    await this.deleteHeaderMenuTranslations(menuId, tx);
    return await this.createHeaderMenuTranslation(body, menuId, tx);
  }
}
