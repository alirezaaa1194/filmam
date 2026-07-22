import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ContactStatus } from '../../generated/prisma';
import { PaginationMetaDto } from '../../common/dto/response.dto';

export class ContactResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  created_at!: Date;

  @ApiProperty()
  updated_at!: Date;

  @ApiProperty()
  user_email!: string;

  @ApiProperty()
  message!: string;

  @ApiProperty()
  is_registered!: boolean;

  @ApiProperty({ enum: ContactStatus })
  status!: ContactStatus;

  @ApiPropertyOptional()
  answer_message?: string;

  @ApiPropertyOptional()
  rejected_detail?: string;
}

export class PaginatedContactsDto extends PaginationMetaDto {
  @ApiProperty({ type: [ContactResponseDto] })
  data!: ContactResponseDto[];
}
