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
import { ApiBearerAuth } from '@nestjs/swagger';
import { TagService } from './tag.service';
import { CreateTagDto, DeleteTagsDto, GetAllTagsDto } from './dto/tag.dto';

@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}
  @Get('all')
  async getAllTags(@Query() query: GetAllTagsDto) {
    return await this.tagService.getAllTags(query);
  }

  @ApiBearerAuth()
  @Get('admin/:tagId')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async getTag(@Param('tagId', ParseIntPipe) tagId: number) {
    return await this.tagService.getTagDetailAdmin(tagId);
  }

  @ApiBearerAuth()
  @Post('admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async createTag(@Body() body: CreateTagDto) {
    return await this.tagService.createTag(body);
  }

  @ApiBearerAuth()
  @Delete('admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async deleteTags(@Body() body: DeleteTagsDto) {
    return await this.tagService.deleteTags(body.tag_ids);
  }

  @ApiBearerAuth()
  @Put('admin/:tagId')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async updateTag(
    @Param('tagId', ParseIntPipe) tagId: number,
    @Body() body: CreateTagDto,
  ) {
    return await this.tagService.updateTag(tagId, body);
  }
}
