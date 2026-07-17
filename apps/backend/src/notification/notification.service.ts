import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/notification.dto';
import { NotificationRepository } from './repository/notification.repository';
import { prisma } from '../lib/prisma';
import webpush from './webpush/web-push.config';

@Injectable()
export class NotificationService {
  constructor(
    private readonly notificationRepository: NotificationRepository,
  ) {}
  async createSubscription(userId: number, body: CreateNotificationDto) {
    return await this.notificationRepository.createSubscription(userId, body);
  }

  async sendNotification(
    userIds: number[],
    title: string,
    description: string,
    image: string,
  ) {
    const usersSubscriptions = await prisma.pushSubscription.findMany({
      where: {
        user_id: { in: userIds },
      },
    });

    if (!usersSubscriptions.length) {
      return;
    }

    const payload = {
      title,
      body: description,
      image,
      icon: 'https://mfrqeblkyvwzbfjvbcto.supabase.co/storage/v1/object/public/filmam-app/assets/IMG_20260220_234248_518.jpg',
      badge:
        'https://mfrqeblkyvwzbfjvbcto.supabase.co/storage/v1/object/public/filmam-app/assets/IMG_20260220_234248_518.jpg',
    };

    const data = JSON.stringify(payload);

    for (const subscription of usersSubscriptions) {
      const pushSubscription = {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: subscription.p256dh,
          auth: subscription.auth,
        },
      };

      try {
        await webpush.sendNotification(pushSubscription, data);
      } catch (error: any) {
        console.log(error);
      }
    }
  }
}
