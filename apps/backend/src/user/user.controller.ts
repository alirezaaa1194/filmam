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
import { UserService } from './user.service';
import {
  BlockUserDto,
  ChangeUserPasswordAdminDto,
  CreateUserDto,
  DeleteUsersDto,
  GetAllUsersDto,
  UpdateUserInfoDto,
} from './dto/user.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { MessageResponseDto } from '../common/dto/response.dto';
import { UserResponseDto, PaginatedUsersDto } from './dto/user.response.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiBearerAuth()
  @ApiCreatedResponse({ type: UserResponseDto })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post('admin')
  async createUserAdmin(@Body() body: CreateUserDto) {
    return await this.userService.createUserAdmin(body);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: PaginatedUsersDto })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('admin/all')
  async getAllUsersAdmin(@Query() query: GetAllUsersDto) {
    return await this.userService.getAllUsersAdmin(query);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: UserResponseDto })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('admin/:userId')
  async getUserAdmin(@Param('userId', ParseIntPipe) userId: number) {
    return await this.userService.getUserById(userId);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: UserResponseDto })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Put('admin/ban-users')
  async banUserAdmin(@Body() body: BlockUserDto) {
    return await this.userService.blockUsers(body);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: MessageResponseDto })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Delete('admin/delete-users')
  async deleteUserAdmin(@Req() req, @Body() body: DeleteUsersDto) {
    return await this.userService.deleteUserAdmin(body, req.user.userId);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: UserResponseDto })
  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteUserAccount(@Req() req) {
    return await this.userService.deleteUserAccount(req.user.userId);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: UserResponseDto })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Put('admin/change-role/:userId')
  async changeUserRoleAdmin(@Param('userId', ParseIntPipe) userId: number) {
    return await this.userService.changeUserRoleAdmin(userId);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: UserResponseDto })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Put('admin/change-password/:userId')
  async changeUserPasswordAdmin(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() body: ChangeUserPasswordAdminDto,
  ) {
    return await this.userService.changeUserPasswordAdmin(userId, body);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: UserResponseDto })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Put('admin/:userId')
  async updateUserInfoAdmin(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() body: UpdateUserInfoDto,
  ) {
    return await this.userService.updateUserInfo(userId, body);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: UserResponseDto })
  @UseGuards(JwtAuthGuard)
  @Put()
  async updateUserInfo(@Req() req, @Body() body: UpdateUserInfoDto) {
    return await this.userService.updateUserInfo(req.user.userId, body);
  }
}
