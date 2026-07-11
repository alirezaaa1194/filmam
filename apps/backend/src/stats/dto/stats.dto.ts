import { ApiPropertyOptional } from '@nestjs/swagger';
import { AppLanguage } from '../../generated/prisma';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetStatsDto {
  @ApiPropertyOptional({
    name: 'lang',
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  lang!: AppLanguage;
}
