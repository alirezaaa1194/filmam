import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import {
  CreateHeaderMenuDto,
  DeleteHeaderMenuDto,
  GetAllHeaderMenusAdminDto,
  GetAllHeaderMenusPublicDto,
} from './dto/header-menu.dto';
import { HeaderMenuService } from './header-menu.service';
import { MessageResponseDto } from '../common/dto/response.dto';
import { HeaderMenuResponseDto, PaginatedHeaderMenusDto } from './dto/header-menu.response.dto';

@Controller('header-menu')
export class HeaderMenuController {
  constructor(private readonly headerMenuService: HeaderMenuService) {}

  @ApiBearerAuth()
  @ApiCreatedResponse({ type: MessageResponseDto })
  @Post('admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async createHeaderMenu(@Body() body: CreateHeaderMenuDto) {
    return await this.headerMenuService.createHeaderMenu(body);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: MessageResponseDto })
  @Put('admin/:menuId')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async updateHeaderMenu(
    @Param('menuId') menuId: number,
    @Body() body: CreateHeaderMenuDto,
  ) {
    return await this.headerMenuService.updateHeaderMenu(menuId, body);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: MessageResponseDto })
  @Delete('admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async deleteHeaderMenus(@Body() body: DeleteHeaderMenuDto) {
    return await this.headerMenuService.deleteHeaderMenus(body);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: PaginatedHeaderMenusDto })
  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async getAllHeaderMenusAdmin(@Query() query: GetAllHeaderMenusAdminDto) {
    return await this.headerMenuService.getAllHeaderMenusAdmin(query);
  }

  @ApiOkResponse({ type: [HeaderMenuResponseDto] })
  @Get('public/all')
  async getAllHeaderMenusPublic(@Query() query: GetAllHeaderMenusPublicDto) {
    return await this.headerMenuService.getAllHeaderMenusPublic(query);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: HeaderMenuResponseDto })
  @Get('admin/:menuId')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async getHeaderMenuDetail(@Param('menuId') menuId: number) {
    return await this.headerMenuService.getHeaderMenuDetail(menuId);
  }
}
