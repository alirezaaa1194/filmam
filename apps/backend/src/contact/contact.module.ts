import { Module } from '@nestjs/common';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { ContactRepository } from './repository/contact.repository';
import { UserModule } from '../user/user.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [UserModule, MailModule],
  controllers: [ContactController],
  providers: [ContactService, ContactRepository],
  exports: [ContactService, ContactRepository],
})
export class ContactModule {}
