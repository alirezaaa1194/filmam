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
  GetAllUserMovieDto,
  GetAllUsersDto,
  UpdateUserInfoDto,
} from './dto/user.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post('admin/create-user')
  async createUserAdmin(@Body() body: CreateUserDto) {
    return await this.userService.createUserAdmin(body);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('admin/all')
  async getAllUsersAdmin(@Query() query: GetAllUsersDto) {
    return await this.userService.getAllUsersAdmin(query);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('admin/:userId')
  async getUserAdmin(@Param('userId', ParseIntPipe) userId: number) {
    return await this.userService.getUserById(userId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Put('admin/ban/:userId')
  async banUserAdmin(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() body: BlockUserDto,
  ) {
    return await this.userService.blockUser(userId, body.block_expires_at);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Delete('admin/delete-users')
  async deleteUserAdmin(@Body() body: DeleteUsersDto) {
    return await this.userService.deleteUserAdmin(body);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete('delete-account')
  async deleteUserAccount(@Req() req) {
    return await this.userService.deleteUserAccount(req.user.userId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Put('admin/change-role/:userId')
  async changeUserRoleAdmin(@Param('userId', ParseIntPipe) userId: number) {
    return await this.userService.changeUserRoleAdmin(userId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Put('admin/change-password/:userId')
  async changeUserPasswordAdmin(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() body: ChangeUserPasswordAdminDto,
  ) {
    return await this.userService.changeUserPasswordAdmin(userId, body);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Put('admin/:userId')
  async updateUserInfoAdmin(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() body: UpdateUserInfoDto,
  ) {
    return await this.userService.updateUserInfo(userId, body);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put('update-info')
  async updateUserInfo(@Req() req, @Body() body: UpdateUserInfoDto) {
    return await this.userService.updateUserInfo(req.user.userId, body);
  }

  // @ApiBearerAuth()
  // @Get('movies')
  // @UseGuards(JwtAuthGuard)
  // async getAllUserMovies(@Req() req, @Query() query: GetAllUserMovieDto) {
  //   return await this.userService.getAllUserMovies(req.user.userId, query);
  // }
}
