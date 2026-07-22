import { Injectable } from '@nestjs/common';
import { CreateCountryTranslationDto } from '../dto/country-translation.dto';
import { TransactionType } from '../../common/types/types';

@Injectable()
export class CountryTranslationRepository {
  async createCountryTranslation(
    body: CreateCountryTranslationDto[],
    countryId: number,
    tx: TransactionType,
  ) {
    const countryTranslationData = body.map((countryTranslation) => ({
      country_id: countryId,
      language: countryTranslation.lang,
      label: countryTranslation.label,
    }));

    return await tx.countryTranslation.createMany({
      data: countryTranslationData,
    });
  }

  async updateCountryTranslation(
    countryId: number,
    body: CreateCountryTranslationDto[],
    tx: TransactionType,
  ) {
    const countryTranslationData = body.map((countryTranslation) => ({
      country_id: countryId,
      language: countryTranslation.lang,
      label: countryTranslation.label,
    }));

    await tx.countryTranslation.deleteMany({
      where: {
        country_id: countryId,
      },
    });

    return await tx.countryTranslation.createMany({
      data: countryTranslationData,
    });
  }
}
