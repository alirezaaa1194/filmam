import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ContactRepository } from './repository/contact.repository';
import {
  AnswerContactDto,
  CreateContactDto,
  DeleteContactsDto,
  GetAllContactsDto,
  RejectContactDto,
} from './dto/contact.dto';
import { UserService } from '../user/user.service';
import { paginationCalculator } from '../lib/utils';
import { prisma } from '../lib/prisma';
import { ContactStatus } from '../generated/prisma';
import { MailService } from '../mail/mail.service';

@Injectable()
export class ContactService {
  constructor(
    private readonly contactRepository: ContactRepository,
    private readonly userService: UserService,
    private readonly mailService: MailService,
  ) {}
  async createContact(body: CreateContactDto) {
    const user = await this.userService.getUserByEmail(body.user_email);
    return await this.contactRepository.createContact({
      ...body,
      is_registered: !!user,
    });
  }

  async deleteContacts(body: DeleteContactsDto) {
    return await this.contactRepository.deleteContacts(body);
  }

  async answerContact(contactId: number, body: AnswerContactDto) {
    const contact = await this.contactRepository.getContactDetail(contactId);
    if (contact) {
      if (contact.status === ContactStatus.ANSWERED) {
        throw new BadRequestException('contact has already been answered');
      } else if (contact.status === ContactStatus.REJECTED) {
        throw new BadRequestException('contact rejected previously');
      }

      await this.mailService.sendEmail(
        contact.user_email,
        'پاسخ پشتیبانی',
        `<div style="max-width: 500px; margin: 0 auto; padding: 30px; font-family: Tahoma, sans-serif; border: 1px solid #e0e0e0; border-radius: 10px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #00925d; margin: 0;">فیلمام</h1>
        <p style="color: #999;">فیلم و سریال</p>
      </div>
      
      <div style="background-color: #f8f9fa; padding: 30px; border-radius: 8px; text-align: center;">
        <p style="color: #666; font-size: 16px; margin-bottom: 20px;">
          پاسخ پشتیبانی
        </p>
        <p style="color: #999;">${body.answer_message}</p>
      </div>
      
      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
      
      <p style="color: #999; font-size: 11px; text-align: center;">
        اگر این ایمیل را درخواست نکرده‌اید، آن را نادیده بگیرید.<br>
        © 2026 فیلمام
      </p>
    </div>
  `,
      );

      return await this.contactRepository.answerContact(contactId, body);
    } else {
      throw new NotFoundException('contact was not found');
    }
  }

  async rejectContact(contactId: number, body: RejectContactDto) {
    const contact = await this.contactRepository.getContactDetail(contactId);

    if (contact) {
      if (contact.status !== ContactStatus.PENDING) {
        throw new BadRequestException('Can not change closed contact');
      }

      await this.mailService.sendEmail(
        contact.user_email,
        'پاسخ پشتیبانی',
        `<div style="max-width: 500px; margin: 0 auto; padding: 30px; font-family: Tahoma, sans-serif; border: 1px solid #e0e0e0; border-radius: 10px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #00925d; margin: 0;">فیلمام</h1>
        <p style="color: #999;">فیلم و سریال</p>
      </div>
      
      <div style="background-color: #f8f9fa; padding: 30px; border-radius: 8px; text-align: center;">
        <p style="color: #666; font-size: 16px; margin-bottom: 20px;">
         پاسخ پشتیبانی - پیام شما رد شد
        </p>
        <p style="color: #999;">${body.rejected_detail}</p>
      </div>
      
      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
      
      <p style="color: #999; font-size: 11px; text-align: center;">
        اگر این ایمیل را درخواست نکرده‌اید، آن را نادیده بگیرید.<br>
        © 2026 فیلمام
      </p>
    </div>
  `,
      );
      return await this.contactRepository.rejectContact(contactId, body);
    } else {
      throw new NotFoundException('contact was not found');
    }
  }

  async getContactDetail(contactId: number) {
    const contact = await this.contactRepository.getContactDetail(contactId);
    if (contact) {
      return contact;
    } else {
      throw new NotFoundException('contact was not found');
    }
  }

  async getAllContacts(query: GetAllContactsDto) {
    const { page, page_size } = paginationCalculator(
      query.page || 1,
      query.page_size || 10,
    );

    const result = prisma.$transaction(async (tx) => {
      const contacts = await this.contactRepository.getAllContacts(
        {
          ...query,
          page,
          page_size,
        },
        tx,
      );

      const allContactsCount = await this.contactRepository.getAllContactsCount(
        query.search,
        tx,
        query.status,
      );

      return {
        page: page + 1,
        page_size,
        count: allContactsCount,
        data: contacts,
      };
    });

    return result;
  }
}
