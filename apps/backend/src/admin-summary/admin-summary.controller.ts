import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminSummaryService } from './admin-summary.service';
import { RoleGuard } from '../auth/guards/role.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('admin/summary')
export class AdminSummaryController {
  constructor(private readonly adminSummaryService: AdminSummaryService) {}

  @ApiBearerAuth()
  @Get()
  @UseGuards(JwtAuthGuard, RoleGuard)
  async getSummary() {
    return await this.adminSummaryService.getSummary();
  }
}
