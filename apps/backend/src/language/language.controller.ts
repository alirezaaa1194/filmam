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
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { LanguageService } from './language.service';
import {
  CreateLanguageDto,
  DeleteLanguagesDto,
  GetAllLanguagesDto,
} from './dto/language.dto';
import { CountResponseDto } from '../common/dto/response.dto';
import { LanguageResponseDto, PaginatedLanguagesDto } from './dto/language.response.dto';

@Controller('language')
export class LanguageController {
  constructor(private readonly languageService: LanguageService) {}

  @ApiOkResponse({ type: PaginatedLanguagesDto })
  @Get('all')
  async getAllLanguages(@Query() query: GetAllLanguagesDto) {
    return await this.languageService.getAllLanguages(query);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: LanguageResponseDto })
  @Get('admin/:languageId')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async getLanguageDetailAdmin(@Param('languageId', ParseIntPipe) languageId: number) {
    return await this.languageService.getLanguageDetailAdmin(languageId);
  }

  @ApiBearerAuth()
  @ApiCreatedResponse({ type: CountResponseDto })
  @Post('admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async createLanguage(@Body() body: CreateLanguageDto) {
    return await this.languageService.createLanguage(body);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: CountResponseDto })
  @Delete('admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async deleteLanguages(@Body() body: DeleteLanguagesDto) {
    return await this.languageService.deleteLanguages(body.language_ids);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: CountResponseDto })
  @Put('admin/:languageId')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async updateLanguage(
    @Param('languageId', ParseIntPipe) languageId: number,
    @Body() body: CreateLanguageDto,
  ) {
    return await this.languageService.updateLanguage(languageId, body);
  }
}
