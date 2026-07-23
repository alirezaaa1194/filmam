import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from '../dto/notification.dto';
import { prisma } from '../../lib/prisma';

@Injectable()
export class NotificationRepository {
  async createSubscription(userId: number, body: CreateNotificationDto) {
    return await prisma.pushSubscription.create({
      data: {
        user_id: userId,
        ...body,
      },
    });
  }

  async getPushSubscriptionsByUserIds(userIds: number[]) {
    return await prisma.pushSubscription.findMany({
      where: {
        user_id: { in: userIds },
      },
      include: { user: true },
    });
  }
}
