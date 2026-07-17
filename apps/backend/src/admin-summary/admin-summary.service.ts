import { Injectable } from '@nestjs/common';
import { prisma } from '../lib/prisma';
import { CommentStatus, ContactStatus } from '../generated/prisma';

@Injectable()
export class AdminSummaryService {
  constructor() {}
  async getSummary() {
    const result = await prisma.$transaction(async (tx) => {
      const pendingCommentsCount = await tx.comment.count({
        where: { status: CommentStatus.PENDING },
      });
      const pendingContactsCount = await tx.contact.count({
        where: { status: ContactStatus.PENDING },
      });

      return {
        comments: pendingCommentsCount,
        contacts: pendingContactsCount,
      };
    });
    return result;
  }
}
