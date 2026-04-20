import { Module } from '@nestjs/common';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { UserModule } from '../user/user.module';
import { CountryService } from './country.service';
import { CountryRepository } from './repository/country.repository';
import { CountryController } from './country.controller';
import { CountryTranslationModule } from '../country-translation/country-translation.module';

@Module({
  imports: [UserModule, CountryTranslationModule],
  providers: [CountryService, CountryRepository, JwtStrategy],
  controllers: [CountryController],
  exports: [CountryService, CountryRepository],
})
export class CountryModule {}
