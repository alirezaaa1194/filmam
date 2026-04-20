import { Injectable } from '@nestjs/common';
import { RoleTranslationRepository } from './repository/role-translation.repository';
import { CreateRoleTranslationDto } from './dto/role-translation.dto';
import { TransactionType } from '../common/types/types';

@Injectable()
export class RoleTranslationService {
  constructor(private RoleTranslationRepository: RoleTranslationRepository) {}

  async createRoleTranslation(
    body: CreateRoleTranslationDto[],
    RoleId: number,
    tx: TransactionType,
  ) {
    return await this.RoleTranslationRepository.createRoleTranslation(
      body,
      RoleId,
      tx,
    );
  }

  async updateRoleTranslation(
    RoleId: number,
    body: CreateRoleTranslationDto[],
    tx: TransactionType,
  ) {
    return await this.RoleTranslationRepository.updateRoleTranslation(
      RoleId,
      body,
      tx,
    );
  }
}
