import { Module } from '@nestjs/common';
import { HeaderMenuTranslationService } from './header-menu-translation.service';
import { HeaderMenuTranslationRepository } from './repository/header-menu-translation.repository';

@Module({
  providers: [HeaderMenuTranslationService, HeaderMenuTranslationRepository],
  exports: [HeaderMenuTranslationService, HeaderMenuTranslationRepository],
})

export class HeaderMenuTranslationModule {}
