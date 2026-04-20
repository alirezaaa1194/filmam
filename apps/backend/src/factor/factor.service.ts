import { Injectable, NotFoundException } from '@nestjs/common';
import { FactorRepository } from './repository/factor.repository';
import {
  CreateFactorDto,
  DeleteFactorsDto,
  GetAllFactorsDto,
} from './dto/factor.dto';
import { FactorTranslationService } from '../factor-translation/factor-translation.service';
import { FactorFileService } from '../factor-file/factor-file.service';
import { UploadService } from '../upload/upload.service';
import { AppLanguage } from '@prisma/client';
import { defaultLang, paginationCalculator } from '../lib/utils';
import { MovieFactorService } from '../movie-factor/movie-factor.service';
import { GetFactorMoviesDto } from '../movie-factor/dto/movie-factor.dto';
import { SortType } from '../common/enums';
import { prisma } from '../lib/prisma';

@Injectable()
export class FactorService {
  constructor(
    private factorRepository: FactorRepository,
    private factorTranslationService: FactorTranslationService,
    private factorFileService: FactorFileService,
    private uploadService: UploadService,
    private movieFactorService: MovieFactorService,
  ) {}

  async createFactor(body: CreateFactorDto) {
    const result = await prisma.$transaction(async (tx) => {
      const createdFactor = await this.factorRepository.createFactor(
        body.slug,
        tx,
      );

      await this.factorTranslationService.createFactorTranslation(
        createdFactor.id,
        body.translations,
        tx,
      );

      if (body.profile) {
        await this.factorFileService.createFactorFile(
          {
            ...body.profile,
            factor_id: createdFactor.id,
          },
          tx,
        );
      }

      return createdFactor;
    });

    return result;
  }

  async deleteFactors(body: DeleteFactorsDto) {
    const factorsUploads = await this.factorFileService.getFactorsFiles(
      body.factor_ids,
    );
    const factorsUploadIds = factorsUploads.map(
      (factorUpload) => factorUpload.upload_id,
    );
    await this.uploadService.deleteUploads(factorsUploadIds);
    return await this.factorRepository.deleteFactors(body.factor_ids);
  }

  async getAllFactors(query: GetAllFactorsDto) {
    const { page, page_size } = paginationCalculator(
      query.page || 1,
      query.page_size || 10,
    );
    const factors = await this.factorRepository.getAllFactors({
      page,
      page_size,
      search: query.search ?? '',
      lang: query.lang || defaultLang,
      sort_type: query.sort === SortType.ASC ? 'asc' : 'desc',
    });
    const normalizedFactors = factors.map((factor) => {
      const { upload, ...otherFactorProfileData } = factor.files[0] || {};
      const { files, translations, ...otherFactorData } = factor;
      const factorTranslationData = factor.translations[0];
      return {
        ...otherFactorData,
        first_name: factorTranslationData.first_name,
        last_name: factorTranslationData.last_name,
        profile: factor.files[0]
          ? { ...otherFactorProfileData, path: upload.path }
          : null,
      };
    });

    const factorsCount = await this.factorRepository.getFactorsCount(
      query.search?.trim(),
    );

    return {
      page: page + 1,
      page_size,
      count: factorsCount,
      data: normalizedFactors,
    };
  }

  async getFactorDetailPublic(
    factorSlug: string,
    lang: AppLanguage = defaultLang,
  ) {
    const factor = await this.factorRepository.getFactorDetailPublic(
      factorSlug,
      lang,
    );
    if (factor) {
      const factorTranslation = factor.translations[0];
      const factorFile = factor.files[0];
      const { translations, files, ...otherFactorData } = factor;
      return {
        ...otherFactorData,
        profile: factorFile?.upload,
        first_name: factorTranslation.first_name,
        last_name: factorTranslation.last_name,
      };
    } else {
      throw new NotFoundException('Factor not found');
    }
  }

  async getFactorDetailAdmin(factorId: number) {
    const factor = await this.factorRepository.getFactorDetailAdmin(factorId);
    if (factor) {
      const factorFile = factor.files[0];
      const { files, ...otherFactorData } = factor;
      return {
        ...otherFactorData,
        profile: factorFile?.upload,
      };
    } else {
      throw new NotFoundException('Factor not found');
    }
  }

  async updateFactor(factorId: number, body: CreateFactorDto) {
    const result = await prisma.$transaction(async (tx) => {
      const updatedFactor = await this.factorRepository.updateFactor(
        factorId,
        body.slug,
        tx,
      );
      await this.factorTranslationService.updateFactorTranslation(
        factorId,
        body.translations,
        tx,
      );
      if (body.profile) {
        await this.factorFileService.updateFactorFile(
          factorId,
          body.profile.upload_id,
          tx,
        );
      }
      return updatedFactor;
    });
    return result;
  }

  async getFactorMovies(factorSlug: string, query: GetFactorMoviesDto) {
    return await this.movieFactorService.getFactorMovies(factorSlug, query);
  }
}
