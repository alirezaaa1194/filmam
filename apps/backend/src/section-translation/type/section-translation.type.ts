import { AppLanguage } from '../../generated/prisma';

export type CreateSectionTranslationBodyType = {
  language: AppLanguage;
  title: string;
  description?: string;
  section_id: number;
};
