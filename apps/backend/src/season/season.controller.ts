import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import {
  CreateSeasonDto,
  DeleteSeasonsDto,
  GetAllSeasonsDto,
  GetSeasonEpisodesDto,
} from './dto/season.dto';
import { SeasonService } from './season.service';

@Controller('season')
export class SeasonController {
  constructor(private readonly seasonService: SeasonService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post('admin')
  async createSeason(@Body() body: CreateSeasonDto) {
    return await this.seasonService.createSeason(body);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Put('admin/:seasonId')
  async updateSeason(
    @Body() body: CreateSeasonDto,
    @Param('seasonId', ParseIntPipe) seasonId: number,
  ) {
    return await this.seasonService.updateSeason(seasonId, body);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Delete('admin')
  async deleteSeasons(@Body() body: DeleteSeasonsDto) {
    return await this.seasonService.deleteSeasons(body.season_ids);
  }

  @ApiBearerAuth()
  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async getAllSeasons(@Query() query: GetAllSeasonsDto) {
    return await this.seasonService.getAllSeasons(query);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('admin/:seasonId')
  async getSeasonDetail(@Param('seasonId') seasonId: number) {
    return await this.seasonService.getSeasonDetail(seasonId);
  }

  @Get('/:seasonSlug/episodes')
  async getSeasonEpisodes(
    @Param('seasonSlug') seasonSlug: string,
    @Query() query: GetSeasonEpisodesDto,
  ) {
    return await this.seasonService.getSeasonEpisodes(query, seasonSlug);
  }
}
