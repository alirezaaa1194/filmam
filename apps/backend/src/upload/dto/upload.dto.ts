import { ArrayNotEmpty, IsArray, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UploadFromFileDto {
  @IsString()
  @IsOptional()
  width?: string;

  @IsString()
  @IsOptional()
  height?: string;

  @IsString()
  @IsOptional()
  alt?: string;

  @IsString()
  @IsOptional()
  duration?: string;
}

export class UploadFromUrlDto {
  @IsString()
  @IsOptional()
  width?: string;

  @IsString()
  @IsOptional()
  height?: string;

  @IsString()
  @IsOptional()
  alt?: string;

  @IsString()
  @IsOptional()
  duration?: string;

  @IsString()
  @IsNotEmpty()
  mimeType: string;

  @IsString()
  @IsNotEmpty()
  path: string;
}

export class DeleteUploadDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  uploadIds: number[];
}
