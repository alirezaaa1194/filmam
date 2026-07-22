import { ApiPropertyOptional } from '@nestjs/swagger';
import { AppLanguage } from '../../generated/prisma';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { defaultLang } from '../../lib/utils';

export class GetAnalyticsStatsDto {
  @ApiPropertyOptional({
    name: 'lang',
    enum: AppLanguage,
    default: defaultLang,
    required: false,
  })
  @IsEnum(AppLanguage)
  @IsNotEmpty()
  lang!: AppLanguage;
}
