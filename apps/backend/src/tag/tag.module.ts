import { Module } from '@nestjs/common';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { UserModule } from '../user/user.module';
import { TagService } from './tag.service';
import { TagRepository } from './repository/tag.repository';
import { TagController } from './tag.controller';
import { TagTranslationModule } from '../tag-translation/tag-translation.module';

@Module({
  imports: [UserModule, TagTranslationModule],
  providers: [TagService, TagRepository, JwtStrategy],
  controllers: [TagController],
  exports: [TagService, TagRepository],
})
export class TagModule {}
