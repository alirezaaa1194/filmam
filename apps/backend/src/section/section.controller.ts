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
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { Public } from '../common/decorators/public.decorator';

@Controller('section')
export class SectionController {
  constructor(private sectionService: SectionService) {}

  @ApiBearerAuth()
  @Post('admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async createSectionAdmin(@Body() body: CreateSectionDto) {
    return await this.sectionService.createSectionAdmin(body);
  }

  @ApiBearerAuth()
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

  @Get('public/all')
  @ApiBearerAuth()
  @Public()
  @UseGuards(JwtAuthGuard)
  async getAllSections(@Query() query: GetAllSectionsDto, @Req() req) {
    return await this.sectionService.getAllSections(query, req?.user?.userId);
  }

  @ApiBearerAuth()
  @Put('admin/:sectionId')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async updateSectionAdmin(
    @Body() body: CreateSectionDto,
    @Param('sectionId', ParseIntPipe) sectionId: number,
  ) {
    return await this.sectionService.updateSectionAdmin(sectionId, body);
  }

  @ApiBearerAuth()
  @Delete('admin')
  async deleteSectionsAdmin(@Body() body: DeleteSectionsDto) {
    return await this.sectionService.deleteSectionsAdmin(body);
  }
}
