import { ApiProperty } from '@nestjs/swagger';

export class PushSubscriptionResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  endpoint!: string;

  @ApiProperty()
  created_at!: Date;
}
