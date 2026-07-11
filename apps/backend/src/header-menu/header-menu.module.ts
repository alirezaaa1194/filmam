import { Module } from '@nestjs/common';
import { HeaderMenuService } from './header-menu.service';
import { HeaderMenuRepository } from './repository/header-menu.repository';
import { HeaderMenuController } from './header-menu.controller';
import { UserModule } from '../user/user.module';
import { HeaderMenuTranslationModule } from '../header-menu-translation/header-menu-translation.module';
import { HeaderMenuFilterModule } from '../header-menu-filter/header-menu-filter.module';

@Module({
  imports: [UserModule, HeaderMenuTranslationModule, HeaderMenuFilterModule],
  providers: [HeaderMenuService, HeaderMenuRepository],
  controllers: [HeaderMenuController],
  exports: [HeaderMenuService, HeaderMenuRepository],
})
export class HeaderMenuModule {}
