import { AppLanguage } from '../../generated/prisma';

export type CreateSeasonTranslationPropsType = {
  season_id: number;
  title: string;
  short_description: string;
  language: AppLanguage;
};
