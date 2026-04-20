import { IsNotEmpty, IsString } from 'class-validator';
import { FactorFileType } from '@prisma/client';

export class CreateFactorFileDto {
  @IsNotEmpty()
  factor_id: number;

  @IsNotEmpty()
  upload_id: number;

  @IsString()
  @IsNotEmpty()
  upload_type: FactorFileType;
}
