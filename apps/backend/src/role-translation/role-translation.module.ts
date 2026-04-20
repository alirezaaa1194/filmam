import { Module } from '@nestjs/common';
import { RoleTranslationService } from './role-translation.service';
import { RoleTranslationRepository } from './repository/role-translation.repository';


@Module({
  providers: [RoleTranslationService, RoleTranslationRepository],
  exports: [RoleTranslationService, RoleTranslationRepository],
})
export class RoleTranslationModule {}
