import { ApiProperty } from '@nestjs/swagger';
import { UserRole, AppLanguage } from '../../generated/prisma';
import { PaginationMetaDto } from '../../common/dto/response.dto';

export class UserResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  created_at!: Date;

  @ApiProperty()
  updated_at!: Date;

  @ApiProperty()
  username!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  google_id!: string | null;

  @ApiProperty({ enum: UserRole })
  role!: UserRole;

  @ApiProperty()
  block_expires_at!: Date | null;

  @ApiProperty({ enum: AppLanguage })
  preferred_language!: AppLanguage;
}

export class PaginatedUsersDto extends PaginationMetaDto {
  @ApiProperty({ type: [UserResponseDto] })
  data!: UserResponseDto[];
}
