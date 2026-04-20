import { Module } from '@nestjs/common';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { UserModule } from '../user/user.module';
import { LanguageService } from './language.service';
import { LanguageRepository } from './repository/language.repository';
import { LanguageController } from './language.controller';
import { LanguageTranslationModule } from '../language-translation/language-translation.module';

@Module({
  imports: [UserModule, LanguageTranslationModule],
  providers: [LanguageService, LanguageRepository, JwtStrategy],
  controllers: [LanguageController],
  exports: [LanguageService, LanguageRepository],
})
export class LanguageModule {}
