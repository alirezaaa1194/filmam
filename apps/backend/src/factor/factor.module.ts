import { Module } from '@nestjs/common';
import { FactorController } from './factor.controller';

@Module({
  controllers: [FactorController]
})
export class FactorModule {}
