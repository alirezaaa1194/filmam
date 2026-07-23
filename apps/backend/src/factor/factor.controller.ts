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
import { FactorService } from './factor.service';
import {
  CreateFactorDto,
  DeleteFactorsDto,
  GetAllFactorsDto,
  GetFactorDetailPublicQueryDto,
} from './dto/factor.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { GetFactorMoviesDto } from '../movie-factor/dto/movie-factor.dto';
import { CountResponseDto } from '../common/dto/response.dto';
import {
  FactorResponseDto,
  FactorDetailDto,
  PaginatedFactorsDto,
  PaginatedFactorMoviesDto,
} from './dto/factor.response.dto';

@Controller('factor')
export class FactorController {
  constructor(private factorService: FactorService) {}

  @ApiBearerAuth()
  @ApiCreatedResponse({ type: FactorResponseDto })
  @Post('admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async createFactor(@Body() body: CreateFactorDto) {
    return await this.factorService.createFactor(body);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: CountResponseDto })
  @Delete('admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async deleteFactors(@Body() body: DeleteFactorsDto) {
    return await this.factorService.deleteFactors(body);
  }

  @ApiOkResponse({ type: PaginatedFactorsDto })
  @Get('all')
  async getAllFactors(@Query() query: GetAllFactorsDto) {
    return await this.factorService.getAllFactors(query);
  }

  @ApiOkResponse({ type: FactorDetailDto })
  @Get('public/:factorSlug')
  async getFactorDetailPublic(
    @Param('factorSlug') factorSlug: string,
    @Query() query: GetFactorDetailPublicQueryDto,
  ) {
    return await this.factorService.getFactorDetailPublic(
      factorSlug,
      query.lang,
    );
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: FactorResponseDto })
  @Get('admin/:factorId')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async getFactorDetailAdmin(
    @Param('factorId', ParseIntPipe) factorId: number,
  ) {
    return await this.factorService.getFactorDetailAdmin(factorId);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: FactorResponseDto })
  @Put('admin/:factorId')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async updateFactor(
    @Param('factorId', ParseIntPipe) factorId: number,
    @Body() body: CreateFactorDto,
  ) {
    return await this.factorService.updateFactor(factorId, body);
  }

  @ApiOkResponse({ type: PaginatedFactorMoviesDto })
  @Get('/:factorSlug/movies')
  async getFactorMovies(
    @Param('factorSlug') factorSlug: string,
    @Query() query: GetFactorMoviesDto,
  ) {
    return await this.factorService.getFactorMovies(factorSlug, query);
  }
}
