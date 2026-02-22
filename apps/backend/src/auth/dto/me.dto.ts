import { ApiProperty } from '@nestjs/swagger';

export class MeResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  role: string;

  @ApiProperty()
  googleId: string | null;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;

  @ApiProperty()
  username: string;

  @ApiProperty({ example: new Date().toISOString() })
  block_expires_at: Date | null;
}
