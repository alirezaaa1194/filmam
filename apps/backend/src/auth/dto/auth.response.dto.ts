import { ApiProperty } from '@nestjs/swagger';
import { UserRole, AppLanguage } from '../../generated/prisma';

export class MeResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  email!: string;

  @ApiProperty({ enum: UserRole })
  role!: UserRole;

  @ApiProperty()
  google_id!: string | null;

  @ApiProperty()
  created_at!: Date;

  @ApiProperty()
  updated_at!: Date;

  @ApiProperty()
  username!: string;

  @ApiProperty({ example: new Date().toISOString() })
  block_expires_at!: Date | null;

  @ApiProperty({ enum: AppLanguage })
  preferred_language!: AppLanguage;
}
