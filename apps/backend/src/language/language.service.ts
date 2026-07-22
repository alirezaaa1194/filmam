import { Injectable, NotFoundException } from '@nestjs/common';
import { defaultLang, paginationCalculator } from '../lib/utils';
import { LanguageRepository } from './repository/language.repository';
import { CreateLanguageDto, GetAllLanguagesDto } from './dto/language.dto';
import { LanguageTranslationService } from '../language-translation/language-translation.service';
import { SortType } from '../common/enums';
import { prisma } from '../lib/prisma';

@Injectable()
export class LanguageService {
  constructor(
    private languageRepository: LanguageRepository,
    private languageTranslationService: LanguageTranslationService,
  ) {}
  async getAllLanguages(query: GetAllLanguagesDto) {
    const { page, page_size } = paginationCalculator(
      query.page || 1,
      query.page_size || 10,
    );
    const languages = await this.languageRepository.getAllLanguages({
      page,
      page_size,
      search: query.search?.trim() ?? '',
      lang: query.lang || defaultLang,
      sort_type: query.sort === SortType.ASC ? 'asc' : 'desc',
    });
    const normalizedLanguages = languages.map((language) => {
      const { translations, ...otherLanguageData } = language;
      const languageTranslation = translations[0];
      return {
        ...otherLanguageData,
        label: languageTranslation.label,
      };
    });
    const languagesCount = await this.languageRepository.getLanguagesCount(
      query.search?.trim(),
    );

    return {
      page: page + 1,
      page_size,
      count: languagesCount,
      data: normalizedLanguages,
    };
  }

  async getLanguageDetailAdmin(languageId: number) {
    const language =
      await this.languageRepository.getLanguageDetailAdmin(languageId);
    if (language) {
      return language;
    } else {
      throw new NotFoundException('Language not found');
    }
  }

  async createLanguage(body: CreateLanguageDto) {
    const result = await prisma.$transaction(async (tx) => {
      const createdLanguage = await this.languageRepository.createLanguage(
        body.code,
        tx,
      );
      return await this.languageTranslationService.createLanguageTranslation(
        body.translations,
        createdLanguage.id,
        tx,
      );
    });
    return result;
  }

  async deleteLanguages(languageIds: number[]) {
    return await this.languageRepository.deleteLanguages(languageIds);
  }

  async updateLanguage(languageId: number, body: CreateLanguageDto) {
    const result = await prisma.$transaction(async (tx) => {
      await this.languageRepository.updateLanguage(languageId, body, tx);
      return await this.languageTranslationService.updateLanguageTranslation(
        languageId,
        body.translations,
        tx,
      );
    });
    return result;
  }
}
