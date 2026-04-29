import { ApiProperty } from '@nestjs/swagger';
import { SeasonFileType } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateSeasonFileDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  upload_id: number;

  @ApiProperty({ example: SeasonFileType.POSTER, required: true })
  @IsEnum(SeasonFileType)
  @IsNotEmpty()
  type: SeasonFileType;
}
