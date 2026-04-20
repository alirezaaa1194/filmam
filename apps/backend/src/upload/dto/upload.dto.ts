import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class UploadFromFileDto {
  @ApiProperty({
    type: 'string',
    required: false,
  })
  @IsString()
  @IsOptional()
  width?: string;

  @ApiProperty({
    type: 'string',
    required: false,
  })
  @IsString()
  @IsOptional()
  height?: string;

  @ApiProperty({
    type: 'string',
    required: false,
  })
  @IsString()
  @IsOptional()
  alt?: string;

  @ApiProperty({
    type: 'string',
    required: false,
  })
  @IsString()
  @IsOptional()
  duration?: string;
}

export class UploadFromUrlDto {
  @ApiProperty({
    type: 'string',
    required: false,
  })
  @IsString()
  @IsOptional()
  width?: string;

  @ApiProperty({
    type: 'string',
    required: false,
  })
  @IsString()
  @IsOptional()
  height?: string;

  @ApiProperty({
    type: 'string',
    required: false,
  })
  @IsString()
  @IsOptional()
  alt?: string;

  @ApiProperty({
    type: 'string',
    required: false,
  })
  @IsString()
  @IsOptional()
  duration?: string;

  @ApiProperty({
    type: 'string',
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  mime_type: string;

  @ApiProperty({
    type: 'string',
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  path: string;
}

export class DeleteUploadDto {
  @ApiProperty({
    example: [1, 2, 3],
    required: false,
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  upload_ids: number[];
}
