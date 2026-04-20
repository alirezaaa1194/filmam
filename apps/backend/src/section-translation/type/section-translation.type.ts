import { AppLanguage } from '@prisma/client';

export type CreateSectionTranslationBodyType = {
  language: AppLanguage;
  title: string;
  description?: string;
  section_id: number;
};
