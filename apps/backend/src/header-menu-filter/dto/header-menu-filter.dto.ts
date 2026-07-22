import { ApiProperty } from '@nestjs/swagger';
import { SectionFilterKey } from '../../generated/prisma';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class HeaderMenuFilter {
  @ApiProperty({
    example: SectionFilterKey.GENRES,
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(SectionFilterKey)
  filter_key!: SectionFilterKey;

  @ApiProperty({
    type: 'string',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  filter_value!: string;
}


