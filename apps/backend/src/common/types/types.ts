import { AppLanguage, Prisma, PrismaClient } from '../../generated/prisma';
import { DefaultArgs } from '../../generated/prisma/runtime/library';

export type RepositoryPaginationQueryProps = {
  page: number;
  page_size: number;
  search: string;
  lang: AppLanguage;
  sort_type: 'asc' | 'desc';
  movie_id?: number | null;
};

export type TransactionType = Omit<
  PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$extends'
>;
