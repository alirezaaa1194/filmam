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
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import {
  CreateSeasonDto,
  DeleteSeasonsDto,
  GetAllSeasonsDto,
  GetSeasonEpisodesDto,
} from './dto/season.dto';
import { SeasonService } from './season.service';
import { Public } from '../common/decorators/public.decorator';
import { MessageResponseDto } from '../common/dto/response.dto';
import { SeasonDetailResponseDto, PaginatedSeasonsDto, PaginatedSeasonEpisodesDto } from './dto/season.response.dto';

@Controller('season')
export class SeasonController {
  constructor(private readonly seasonService: SeasonService) {}

  @ApiBearerAuth()
  @ApiCreatedResponse({ type: SeasonDetailResponseDto })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post('admin')
  async createSeason(@Body() body: CreateSeasonDto) {
    return await this.seasonService.createSeason(body);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: SeasonDetailResponseDto })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Put('admin/:seasonId')
  async updateSeason(
    @Body() body: CreateSeasonDto,
    @Param('seasonId', ParseIntPipe) seasonId: number,
  ) {
    return await this.seasonService.updateSeason(seasonId, body);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: MessageResponseDto })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Delete('admin')
  async deleteSeasons(@Body() body: DeleteSeasonsDto) {
    return await this.seasonService.deleteSeasons(body.season_ids);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: PaginatedSeasonsDto })
  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async getAllSeasons(@Query() query: GetAllSeasonsDto) {
    return await this.seasonService.getAllSeasons(query);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: SeasonDetailResponseDto })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('admin/:seasonId')
  async getSeasonDetail(@Param('seasonId') seasonId: number) {
    return await this.seasonService.getSeasonDetail(seasonId);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: PaginatedSeasonEpisodesDto })
  @Get('/:seasonSlug/episodes')
  @Public()
  @UseGuards(JwtAuthGuard)
  async getSeasonEpisodes(
    @Param('seasonSlug') seasonSlug: string,
    @Query() query: GetSeasonEpisodesDto,
    @Req() req,
  ) {
    return await this.seasonService.getSeasonEpisodes(
      query,
      seasonSlug,
      req?.user?.userId,
    );
  }
}
