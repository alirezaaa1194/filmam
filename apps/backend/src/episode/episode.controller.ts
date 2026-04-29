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
  CreateEpisodeDto,
  DeleteEpisodesDto,
  GetAllEpisodesDto,
  GetEpisodeDetailPublicDto,
} from './dto/episode.dto';
import { EpisodeService } from './episode.service';

@Controller('episode')
export class EpisodeController {
  constructor(private readonly episodeService: EpisodeService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post('admin')
  async createEpisode(@Body() body: CreateEpisodeDto) {
    return await this.episodeService.createEpisode(body);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Put('admin/:episodeId')
  async updateEpisode(
    @Body() body: CreateEpisodeDto,
    @Param('episodeId', ParseIntPipe) episodeId: number,
  ) {
    return await this.episodeService.updateEpisode(episodeId, body);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Delete('admin')
  async deleteEpisodes(@Body() body: DeleteEpisodesDto) {
    return await this.episodeService.deleteEpisodes(body.episode_ids);
  }

  @ApiBearerAuth()
  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async getAllEpisodes(@Query() query: GetAllEpisodesDto) {
    return await this.episodeService.getAllEpisodes(query);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('admin/:episodeId')
  async getEpisodeDetailAdmin(
    @Param('episodeId', ParseIntPipe) episodeId: number,
  ) {
    return await this.episodeService.getEpisodeDetailAdmin(episodeId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('/:episodeSlug')
  async getEpisodeDetailPublic(
    @Param('episodeSlug') episodeSlug: string,
    @Query() query: GetEpisodeDetailPublicDto,
  ) {
    return await this.episodeService.getEpisodeDetailPublic(episodeSlug, query);
  }
}
