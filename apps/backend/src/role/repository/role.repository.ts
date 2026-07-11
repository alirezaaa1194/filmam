import { Injectable } from '@nestjs/common';
import { prisma } from '../../lib/prisma';
import { CreateRoleDto } from '../dto/role.dto';
import { RepositoryPaginationQueryProps, TransactionType } from '../../common/types/types';
import { RoleType } from '../../generated/prisma';

@Injectable()
export class RoleRepository {
  async getRolesCount(search: string = '') {
    return await prisma.role.count({
      where: {
        translations: {
          some: {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
      },
    });
  }

  async getAllRoles(query: RepositoryPaginationQueryProps) {
    return await prisma.role.findMany({
      include: {
        translations: {
          where: {
            language: query.lang,
          },
          select: { name: true },
        },
      },
      skip: query.page,
      take: query.page_size,
      where: {
        translations: {
          some: {
            name: {
              contains: query.search,
              mode: 'insensitive',
            },
          },
        },
      },
      orderBy: {
        created_at: query.sort_type,
      },
    });
  }

  async getRoleDetailAdmin(roleId: number) {
    return await prisma.role.findUnique({
      where: {
        id: roleId,
      },
      include: {
        translations: {
          select: {
            id: true,
            created_at: true,
            updated_at: true,
            name: true,
            language: true,
          },
        },
      },
    });
  }

  async createRole(body: CreateRoleDto, tx: TransactionType) {
    return await tx.role.create({
      data: { slug: body.slug, type: body.type as RoleType },
    });
  }

  async deleteRoles(roleIds: number[]) {
    return await prisma.role.deleteMany({
      where: { id: { in: roleIds } },
    });
  }

  async updateRole(roleId: number, body: CreateRoleDto, tx: TransactionType) {
    return await tx.role.update({
      data: {
        slug: body.slug,
      },
      where: { id: roleId },
    });
  }
}
