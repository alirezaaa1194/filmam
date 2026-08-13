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
  UpdateContactsStatusDto,
} from './dto/contact.dto';
import { UserService } from '../user/user.service';
import { paginationCalculator } from '../lib/utils';
import { prisma } from '../lib/prisma';
import { ContactStatus, AppLanguage } from '../generated/prisma';
import { MailService } from '../mail/mail.service';
import { defaultLang } from '../lib/utils';

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

  async updateContactsStatus(body: UpdateContactsStatusDto) {
    if (body.status === ContactStatus.ANSWERED && !body.answer_message) {
      throw new BadRequestException(
        'answer_message is required to answer contacts',
      );
    }
    if (body.status === ContactStatus.REJECTED && !body.rejected_detail) {
      throw new BadRequestException(
        'rejected_detail is required to reject contacts',
      );
    }
    const result = await this.contactRepository.updateContactsStatus(body);
    if (result.count === 0) {
      throw new BadRequestException(
        'No pending contacts found to update status',
      );
    }
    return result;
  }

  async answerContact(contactId: number, body: AnswerContactDto) {
    const contact = await this.contactRepository.getContactDetail(contactId);
    if (contact) {
      if (contact.status === ContactStatus.ANSWERED) {
        throw new BadRequestException('Contact has already been answered');
      } else if (contact.status === ContactStatus.REJECTED) {
        throw new BadRequestException('Contact was rejected previously');
      }

      const user = await this.userService.getUserByEmail(contact.user_email);
      const lang = user?.preferred_language ?? defaultLang;
      const { subject, html } = this.getContactEmailContent(
        'answer',
        body.answer_message,
        lang,
      );

      await this.mailService.sendEmail(contact.user_email, subject, html);

      return await this.contactRepository.answerContact(contactId, body);
    } else {
      throw new NotFoundException('Contact not found');
    }
  }

  async rejectContact(contactId: number, body: RejectContactDto) {
    const contact = await this.contactRepository.getContactDetail(contactId);

    if (contact) {
      if (contact.status !== ContactStatus.PENDING) {
        throw new BadRequestException('Cannot change a closed contact');
      }

      const user = await this.userService.getUserByEmail(contact.user_email);
      const lang = user?.preferred_language ?? defaultLang;
      const { subject, html } = this.getContactEmailContent(
        'reject',
        body.rejected_detail,
        lang,
      );

      await this.mailService.sendEmail(contact.user_email, subject, html);
      return await this.contactRepository.rejectContact(contactId, body);
    } else {
      throw new NotFoundException('Contact not found');
    }
  }

  private getContactEmailContent(
    type: 'answer' | 'reject',
    message: string,
    lang: AppLanguage,
  ): { subject: string; html: string } {
    const content = {
      [AppLanguage.FA]: {
        brand: 'فیلمام',
        tagline: 'فیلم و سریال',
        answerSubject: 'پاسخ پشتیبانی',
        rejectSubject: 'پاسخ پشتیبانی - پیام شما رد شد',
        answerBody: 'پاسخ پشتیبانی',
        rejectBody: 'پاسخ پشتیبانی - پیام شما رد شد',
        footer: 'اگر این ایمیل را درخواست نکرده‌اید، آن را نادیده بگیرید.',
        copyright: '© ۲۰۲۶ فیلمام',
      },
      [AppLanguage.EN]: {
        brand: 'Filmam',
        tagline: 'Movies & Series',
        answerSubject: 'Support Reply',
        rejectSubject: 'Support Reply - Your Message Was Rejected',
        answerBody: 'Support reply',
        rejectBody: 'Support reply - your message was rejected',
        footer: 'If you did not request this email, please ignore it.',
        copyright: '© 2026 Filmam',
      },
      [AppLanguage.AR]: {
        brand: 'فيلمام',
        tagline: 'أفلام ومسلسلات',
        answerSubject: 'رد الدعم',
        rejectSubject: 'رد الدعم - تم رفض رسالتك',
        answerBody: 'رد الدعم',
        rejectBody: 'رد الدعم - تم رفض رسالتك',
        footer: 'إذا لم تطلب هذا البريد الإلكتروني، يرجى تجاهله.',
        copyright: '© ۲۰۲٦ فيلمام',
      },
    };

    const c = content[lang] || content[defaultLang];
    const isAnswer = type === 'answer';

    return {
      subject: isAnswer ? c.answerSubject : c.rejectSubject,
      html: `
    <div style="max-width: 500px; margin: 0 auto; padding: 30px; font-family: Tahoma, sans-serif; border: 1px solid #e0e0e0; border-radius: 10px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #00925d; margin: 0;">${c.brand}</h1>
        <p style="color: #999;">${c.tagline}</p>
      </div>

      <div style="background-color: #f8f9fa; padding: 30px; border-radius: 8px; text-align: center;">
        <p style="color: #666; font-size: 16px; margin-bottom: 20px;">
          ${isAnswer ? c.answerBody : c.rejectBody}
        </p>
        <p style="color: #999;">${message}</p>
      </div>

      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

      <p style="color: #999; font-size: 11px; text-align: center;">
        ${c.footer}<br>
        ${c.copyright}
      </p>
    </div>
  `,
    };
  }

  async getContactDetail(contactId: number) {
    const contact = await this.contactRepository.getContactDetail(contactId);
    if (contact) {
      return contact;
    } else {
      throw new NotFoundException('Contact not found');
    }
  }

  async getAllContacts(query: GetAllContactsDto) {
    const { page, page_size } = paginationCalculator(
      query.page || 1,
      query.page_size || 10,
    );

    const result = await prisma.$transaction(async (tx) => {
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
