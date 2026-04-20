import { AppLanguage, Prisma, PrismaClient } from '@prisma/client';
import { DefaultArgs } from '../../generated/prisma/runtime/library';

export type RepositoryPaginationQueryProps = {
  page: number;
  page_size: number;
  search: string;
  lang: AppLanguage;
  sort_type: 'asc' | 'desc';
};

export type TransactionType = Omit<
  PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$extends'
>;
