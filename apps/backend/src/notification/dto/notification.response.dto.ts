import { ApiProperty } from '@nestjs/swagger';

export class PushSubscriptionResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  endpoint!: string;

  @ApiProperty()
  created_at!: Date;
}

export class SendNotificationTypeDto {
  @ApiProperty({ example: 'Notification sent successfully' })
  message!: string;
}
