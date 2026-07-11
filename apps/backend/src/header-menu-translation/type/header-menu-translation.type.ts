import { AppLanguage } from '../../generated/prisma';

export type CreateHeaderMenuTranslationServiceType = {
  language: AppLanguage;
  title: string;
};

export type CreateHeaderMenuTranslationRepositoryType =
  CreateHeaderMenuTranslationServiceType & {
    menu_id: number;
  };
