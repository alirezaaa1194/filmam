import { Injectable } from '@nestjs/common';
import { prisma } from '../../lib/prisma';
import { CreateContactRepositoryBodyType } from '../type/contact.type';
import {
  AnswerContactDto,
  DeleteContactsDto,
  GetAllContactsDto,
  RejectContactDto,
  UpdateContactsStatusDto,
} from '../dto/contact.dto';
import { ContactStatus } from '../../generated/prisma';
import { TransactionType } from '../../common/types/types';
import { SortType } from '../../common/enums';

@Injectable()
export class ContactRepository {
  async createContact(body: CreateContactRepositoryBodyType) {
    return await prisma.contact.create({ data: body });
  }

  async deleteContacts(body: DeleteContactsDto) {
    return await prisma.contact.deleteMany({
      where: { id: { in: body.contact_ids } },
    });
  }

  async updateContactsStatus(
    body: UpdateContactsStatusDto,
    tx?: TransactionType,
  ) {
    const data =
      body.status === ContactStatus.ANSWERED
        ? { status: body.status, answer_message: body.answer_message }
        : body.status === ContactStatus.REJECTED
          ? { status: body.status, rejected_detail: body.rejected_detail }
          : { status: body.status };
    return await (tx || prisma).contact.updateMany({
      where: { id: { in: body.contact_ids }, status: ContactStatus.PENDING },
      data,
    });
  }

  async answerContact(contactId: number, body: AnswerContactDto) {
    return await prisma.contact.update({
      where: { id: contactId },
      data: { ...body, status: ContactStatus.ANSWERED },
    });
  }

  async rejectContact(contactId: number, body: RejectContactDto) {
    return await prisma.contact.update({
      where: { id: contactId },
      data: { ...body, status: ContactStatus.REJECTED },
    });
  }

  async getContactDetail(contactId: number) {
    return await prisma.contact.findUnique({
      where: { id: contactId },
    });
  }

  async getAllContacts(query: GetAllContactsDto, tx: TransactionType) {
    return await tx.contact.findMany({
      where: {
        OR: [
          {
            message: {
              contains: query.search || '',
              mode: 'insensitive',
            },
          },
          {
            answer_message: {
              contains: query.search || '',
              mode: 'insensitive',
            },
          },
          {
            rejected_detail: {
              contains: query.search || '',
              mode: 'insensitive',
            },
          },
        ],

        ...(query.status?.length
          ? {
              status: { in: query.status },
            }
          : {}),
      },

      take: query.page_size,
      skip: query.page,
      orderBy: {
        created_at: query.sort === SortType.ASC ? 'asc' : 'desc',
      },
    });
  }

  async getAllContactsCount(
    search: string = '',
    tx: TransactionType,
    status?: ContactStatus[],
  ) {
    return await tx.contact.count({
      where: {
        OR: [
          {
            message: {
              contains: search,
              mode: 'insensitive',
            },
          },

          {
            answer_message: {
              contains: search,
              mode: 'insensitive',
            },
          },

          {
            rejected_detail: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ],

        ...(status?.length
          ? {
              status: { in: status },
            }
          : {}),
      },
    });
  }
}
