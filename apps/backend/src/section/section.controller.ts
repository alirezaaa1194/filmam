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
import {
  CreateSectionDto,
  DeleteSectionsDto,
  GetAllSectionsDto,
  GetSectionDetailDto,
} from './dto/section.dto';
import { SectionService } from './section.service';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { Public } from '../common/decorators/public.decorator';
import { CountResponseDto } from '../common/dto/response.dto';
import {
  SectionDetailResponseDto,
  PaginatedSectionsDto,
  PaginatedAdminSectionsDto,
} from './dto/section.response.dto';

@Controller('section')
export class SectionController {
  constructor(private sectionService: SectionService) {}

  @ApiBearerAuth()
  @ApiOkResponse({ type: PaginatedAdminSectionsDto })
  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async getAllSectionsAdmin(@Query() query: GetAllSectionsDto) {
    return await this.sectionService.getAllSectionsAdmin(query);
  }

  @ApiBearerAuth()
  @ApiCreatedResponse({ type: SectionDetailResponseDto })
  @Post('admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async createSectionAdmin(@Body() body: CreateSectionDto) {
    return await this.sectionService.createSectionAdmin(body);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: SectionDetailResponseDto })
  @Get('admin/:sectionId')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async getSectionDetailAdmin(
    @Param('sectionId', ParseIntPipe) sectionId: number,
    @Query() query: GetSectionDetailDto,
  ) {
    return await this.sectionService.getSectionDetailAdmin(
      sectionId,
      query.lang,
    );
  }

  @ApiOkResponse({ type: PaginatedSectionsDto })
  @Get('public/all')
  @ApiBearerAuth()
  @Public()
  @UseGuards(JwtAuthGuard)
  async getAllSections(@Query() query: GetAllSectionsDto, @Req() req) {
    return await this.sectionService.getAllSections(query, req?.user?.userId);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: SectionDetailResponseDto })
  @Put('admin/:sectionId')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async updateSectionAdmin(
    @Body() body: CreateSectionDto,
    @Param('sectionId', ParseIntPipe) sectionId: number,
  ) {
    return await this.sectionService.updateSectionAdmin(sectionId, body);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: CountResponseDto })
  @Delete('admin')
  async deleteSectionsAdmin(@Body() body: DeleteSectionsDto) {
    return await this.sectionService.deleteSectionsAdmin(body);
  }
}
