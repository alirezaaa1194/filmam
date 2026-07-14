import { Controller, Get, UseGuards } from '@nestjs/common';
import { StatsService } from './stats.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('admin/overview')
  async getOverviewStats() {
    return await this.statsService.getOverviewStats();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('admin/analytics')
  async getAnalyticsStats() {
    return await this.statsService.getAnalyticsStats();
  }
}
