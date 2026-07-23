import { Injectable, NotFoundException } from '@nestjs/common';
import { defaultLang, paginationCalculator } from '../lib/utils';
import { CountryRepository } from './repository/country.repository';
import { CreateCountryDto, GetAllCountriesDto } from './dto/country.dto';
import { CountryTranslationService } from '../country-translation/country-translation.service';
import { SortType } from '../common/enums';
import { prisma } from '../lib/prisma';

@Injectable()
export class CountryService {
  constructor(
    private countryRepository: CountryRepository,
    private countryTranslationService: CountryTranslationService,
  ) {}
  async getAllCountries(query: GetAllCountriesDto) {
    const { page, page_size } = paginationCalculator(
      query.page || 1,
      query.page_size || 10,
    );
    const countries = await this.countryRepository.getAllCountries({
      page,
      page_size,
      search: query.search?.trim() ?? '',
      lang: query.lang || defaultLang,
      sort_type: query.sort === SortType.ASC ? 'asc' : 'desc',
    });

    const normalizedCountry = countries.map((country) => {
      const countryTranslationInfo = country.translations[0];
      const { translations, ...otherCountryInfo } = country;
      return { ...otherCountryInfo, label: countryTranslationInfo.label };
    });

    const countriesCount = await this.countryRepository.getCountriesCount(
      query.search?.trim(),
    );

    return {
      page: page + 1,
      page_size,
      count: countriesCount,
      data: normalizedCountry,
    };
  }

  async getCountryDetailAdmin(countryId: number) {
    const country =
      await this.countryRepository.getCountryDetailAdmin(countryId);
    if (country) {
      return country;
    } else {
      throw new NotFoundException('Country not found');
    }
  }

  async createCountry(body: CreateCountryDto) {
    const result = await prisma.$transaction(async (tx) => {
      const createdCountry = await this.countryRepository.createCountry(
        body.code,
        tx,
      );
      await this.countryTranslationService.createCountryTranslation(
        body.translations,
        createdCountry.id,
        tx,
      );

      return createdCountry;
    });

    return result;
  }

  async deleteCountries(countryIds: number[]) {
    return await this.countryRepository.deleteCountries(countryIds);
  }

  async updateCountry(countryId: number, body: CreateCountryDto) {
    const result = await prisma.$transaction(async (tx) => {
      await this.countryTranslationService.updateCountryTranslation(
        countryId,
        body.translations,
        tx,
      );
      return this.countryRepository.updateCountry(countryId, body, tx);
    });
    return result;
  }
}
