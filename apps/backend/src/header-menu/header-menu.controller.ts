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
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import {
  CreateHeaderMenuDto,
  DeleteHeaderMenuDto,
  GetAllHeaderMenusAdminDto,
  GetAllHeaderMenusPublicDto,
} from './dto/header-menu.dto';
import { HeaderMenuService } from './header-menu.service';

@Controller('header-menu')
export class HeaderMenuController {
  constructor(private readonly headerMenuService: HeaderMenuService) {}

  @ApiBearerAuth()
  @Post('admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async createHeaderMenu(@Body() body: CreateHeaderMenuDto) {
    return await this.headerMenuService.createHeaderMenu(body);
  }

  @ApiBearerAuth()
  @Put('admin/:menuId')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async updateHeaderMenu(
    @Param('menuId') menuId: number,
    @Body() body: CreateHeaderMenuDto,
  ) {
    return await this.headerMenuService.updateHeaderMenu(menuId, body);
  }

  @ApiBearerAuth()
  @Delete('admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async deleteHeaderMenus(@Body() body: DeleteHeaderMenuDto) {
    return await this.headerMenuService.deleteHeaderMenus(body);
  }

  @ApiBearerAuth()
  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async getAllHeaderMenusAdmin(@Query() query: GetAllHeaderMenusAdminDto) {
    return await this.headerMenuService.getAllHeaderMenusAdmin(query);
  }

  @Get('public/all')
  async getAllHeaderMenusPublic(@Query() query: GetAllHeaderMenusPublicDto) {
    return await this.headerMenuService.getAllHeaderMenusPublic(query);
  }

  @ApiBearerAuth()
  @Get('admin/:menuId')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async getHeaderMenuDetail(@Param('menuId') menuId: number) {
    return await this.headerMenuService.getHeaderMenuDetail(menuId);
  }
}
