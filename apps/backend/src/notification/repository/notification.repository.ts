import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from '../dto/notification.dto';
import { prisma } from '../../lib/prisma';

@Injectable()
export class NotificationRepository {
  async createSubscription(userId: number, body: CreateNotificationDto) {
    await prisma.pushSubscription.create({
      data: {
        user_id: userId,
        ...body,
      },
    });
  }
}
