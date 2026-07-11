import { AppLanguage } from '../../generated/prisma';

export type CreateEpisodeTranslationPropsType = {
  episode_id: number;
  title: string;
  short_description: string;
  language: AppLanguage;
};
