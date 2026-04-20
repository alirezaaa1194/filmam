import { Injectable, NotFoundException } from '@nestjs/common';
import { RoleRepository } from './repository/role.repository';
import { CreateRoleDto, DeleteRoleDto, GetAllRolesDto } from './dto/role.dto';
import { RoleTranslationService } from '../role-translation/role-translation.service';
import { defaultLang, paginationCalculator } from '../lib/utils';
import { SortType } from '../common/enums';
import { prisma } from '../lib/prisma';

@Injectable()
export class RoleService {
  constructor(
    private roleRepository: RoleRepository,
    private RoleTranslationService: RoleTranslationService,
  ) {}
  async getAllRoles(query: GetAllRolesDto) {
    const { page, page_size } = paginationCalculator(
      query.page || 1,
      query.page_size || 10,
    );
    const roles = await this.roleRepository.getAllRoles({
      page,
      page_size,
      search: query.search?.trim() || '',
      lang: query.lang || defaultLang,
      sort_type: query.sort === SortType.ASC ? 'asc' : 'desc',
    });

    const normalizedRoles = roles.map((role) => {
      const { translations, ...otherRoleData } = role;
      const roleTranslation = translations[0];
      return { ...otherRoleData, name: roleTranslation.name };
    });
    const rolesCount = await this.roleRepository.getRolesCount(
      query.search?.trim(),
    );
    return {
      page: page + 1,
      page_size,
      count: rolesCount,
      data: normalizedRoles,
    };
  }

  async getRoleDetailAdmin(roleId: number) {
    const role = await this.roleRepository.getRoleDetailAdmin(roleId);
    if (role) {
      return role;
    } else {
      throw new NotFoundException('Role not found');
    }
  }

  async createRole(body: CreateRoleDto) {
    const result = await prisma.$transaction(async (tx) => {
      const createdRole = await this.roleRepository.createRole(body, tx);
      return await this.RoleTranslationService.createRoleTranslation(
        body.translations,
        createdRole.id,
        tx,
      );
    });
    return result;
  }

  async deleteRoles(body: DeleteRoleDto) {
    return await this.roleRepository.deleteRoles(body.role_ids);
  }

  async updateRole(RoleId: number, body: CreateRoleDto) {
    const result = await prisma.$transaction(async (tx) => {
      await this.roleRepository.updateRole(RoleId, body, tx);
      return await this.RoleTranslationService.updateRoleTranslation(
        RoleId,
        body.translations,
        tx,
      );
    });
    return result;
  }
}
