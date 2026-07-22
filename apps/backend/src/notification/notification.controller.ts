import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import {
  CreateNotificationDto,
  SendNotificationDto,
} from './dto/notification.dto';
import { defaultLang } from '../lib/utils';
import { MessageResponseDto } from '../common/dto/response.dto';
import { PushSubscriptionResponseDto } from './dto/notification.response.dto';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({ type: PushSubscriptionResponseDto })
  @Post()
  async createSubscription(@Req() req, @Body() body: CreateNotificationDto) {
    return await this.notificationService.createSubscription(
      req.user.userId,
      body,
    );
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: MessageResponseDto })
  @Post('send')
  @UseGuards(JwtAuthGuard)
  async testNotification(@Req() req, @Body() body: SendNotificationDto) {
    return await this.notificationService.sendNotification(
      [req.user.userId],
      [
        {
          title: body.title,
          description: body.description,
          image:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpzt95j-gQy0i3tz2b3MCxW1297o5lEt70nKrUtVJJiA&s',
          lang: defaultLang,
        },
      ],
    );
  }
}
