import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/notification.dto';
import { NotificationRepository } from './repository/notification.repository';
import { prisma } from '../lib/prisma';
import webpush from './webpush/web-push.config';
import { AppLanguage } from '../generated/prisma';
import { defaultLang } from '../lib/utils';

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
    notificationContent: {
      title: string;
      description: string;
      image: string | null;
      lang: AppLanguage;
    }[],
  ) {
    const usersSubscriptions = await prisma.pushSubscription.findMany({
      where: {
        user_id: { in: userIds },
      },
      include: { user: true },
    });

    if (!usersSubscriptions.length) {
      return;
    }

    for (const subscription of usersSubscriptions) {
      const userPreferredContent = notificationContent.find(
        (nc) => nc.lang === subscription.user.preferred_language,
      );

      const payload = {
        title: userPreferredContent?.title,
        body: userPreferredContent?.description,
        image: userPreferredContent?.image,
        icon: 'https://mfrqeblkyvwzbfjvbcto.supabase.co/storage/v1/object/public/filmam-app/assets/IMG_20260220_234248_518.jpg',
        badge:
          'https://mfrqeblkyvwzbfjvbcto.supabase.co/storage/v1/object/public/filmam-app/assets/IMG_20260220_234248_518.jpg',
      };

      const data = JSON.stringify(payload);

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
