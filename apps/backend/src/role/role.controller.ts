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
import { CreateRoleDto, DeleteRoleDto, GetAllRolesDto } from './dto/role.dto';
import { RoleService } from './role.service';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}
  @ApiBearerAuth()
  @Get('all')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async getAllRoles(@Query() query: GetAllRolesDto) {
    return await this.roleService.getAllRoles(query);
  }

  @ApiBearerAuth()
  @Get('admin/:roleId')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async getRoleDetailAdmin(@Param('roleId', ParseIntPipe) roleId: number) {
    return await this.roleService.getRoleDetailAdmin(roleId);
  }

  @ApiBearerAuth()
  @Post('admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async createRole(@Body() body: CreateRoleDto) {
    return await this.roleService.createRole(body);
  }

  @ApiBearerAuth()
  @Delete('admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async deleteRoles(@Body() body: DeleteRoleDto) {
    return await this.roleService.deleteRoles(body);
  }

  @ApiBearerAuth()
  @Put('admin/:roleId')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async updateRole(
    @Param('roleId', ParseIntPipe) roleId: number,
    @Body() body: CreateRoleDto,
  ) {
    return await this.roleService.updateRole(roleId, body);
  }
}
