import { AppLanguage } from '@prisma/client';

export type CreateSeasonTranslationPropsType = {
  season_id: number;
  title: string;
  language: AppLanguage;
};
