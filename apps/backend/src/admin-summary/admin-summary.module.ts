import { Module } from '@nestjs/common';
import { AdminSummaryController } from './admin-summary.controller';
import { AdminSummaryService } from './admin-summary.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  controllers: [AdminSummaryController],
  providers: [AdminSummaryService],
})
export class AdminSummaryModule {}
