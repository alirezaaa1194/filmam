import { AppLanguage } from '../../generated/prisma';

export type CreateSeasonTranslationPropsType = {
  season_id: number;
  title: string;
  language: AppLanguage;
};
