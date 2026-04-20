import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleRepository } from './repository/role.repository';
import { RoleTranslationModule } from '../role-translation/role-translation.module';
import { RoleController } from './role.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [RoleTranslationModule, UserModule],
  providers: [RoleService, RoleRepository],
  exports: [RoleService, RoleRepository],
  controllers: [RoleController],
})
export class RoleModule {}
