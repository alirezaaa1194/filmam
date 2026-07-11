import { Module } from '@nestjs/common';
import { HeaderMenuFilterService } from './header-menu-filter.service';
import { HeaderMenuFilterRepository } from './repository/header-menu-filter.repository';

@Module({
  providers: [HeaderMenuFilterService, HeaderMenuFilterRepository],
  exports: [HeaderMenuFilterService, HeaderMenuFilterRepository],
})
export class HeaderMenuFilterModule {}
