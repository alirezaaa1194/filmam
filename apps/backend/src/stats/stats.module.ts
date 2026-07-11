import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsRepository } from './repository/stats.repository';
import { StatsController } from './stats.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  providers: [StatsService, StatsRepository],
  controllers: [StatsController],
  exports: [StatsService, StatsRepository],
})
export class StatsModule {}
