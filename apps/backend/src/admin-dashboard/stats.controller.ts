import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { StatsService } from './stats.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { GetAnalyticsStatsDto } from './dto/stats.dto';

@Controller('admin')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('stats/overview')
  async getOverviewStats() {
    return await this.statsService.getOverviewStats();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('stats/analytics')
  async getAnalyticsStats(@Query() query: GetAnalyticsStatsDto) {
    return await this.statsService.getAnalyticsStats(query);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('summary')
  async getSummary() {
    return await this.statsService.getSummary();
  }
}
