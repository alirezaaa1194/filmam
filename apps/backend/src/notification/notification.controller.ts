import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import {
  CreateNotificationDto,
  SendNotificationDto,
} from './dto/notification.dto';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  async createSubscription(@Req() req, @Body() body: CreateNotificationDto) {
    return await this.notificationService.createSubscription(
      req.user.userId,
      body,
    );
  }

  @ApiBearerAuth()
  @Post('send')
  @UseGuards(JwtAuthGuard)
  async testNotification(@Req() req, @Body() body: SendNotificationDto) {
    await this.notificationService.sendNotification(
      [req.user.userId],
      body.title,
      body.description,
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpzt95j-gQy0i3tz2b3MCxW1297o5lEt70nKrUtVJJiA&s',
    );

    return {
      success: true,
    };
  }
}
