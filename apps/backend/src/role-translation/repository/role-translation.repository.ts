import { Injectable } from '@nestjs/common';
import { CreateRoleTranslationDto } from '../dto/role-translation.dto';
import { TransactionType } from '../../common/types/types';

@Injectable()
export class RoleTranslationRepository {
  async createRoleTranslation(
    body: CreateRoleTranslationDto[],
    RoleId: number,
    tx: TransactionType,
  ) {
    const RoleTranslationData = body.map((RoleTranslation) => ({
      role_id: RoleId,
      language: RoleTranslation.lang,
      name: RoleTranslation.name,
    }));

    return await tx.roleTranslation.createMany({
      data: RoleTranslationData,
    });
  }

  async updateRoleTranslation(
    RoleId: number,
    body: CreateRoleTranslationDto[],
    tx: TransactionType,
  ) {
    const RoleTranslationData = body.map((RoleTranslation) => ({
      role_id: RoleId,
      language: RoleTranslation.lang,
      name: RoleTranslation.name,
    }));

    await tx.roleTranslation.deleteMany({
      where: {
        role_id: RoleId,
      },
    });

    return await tx.roleTranslation.createMany({
      data: RoleTranslationData,
    });
  }
}
