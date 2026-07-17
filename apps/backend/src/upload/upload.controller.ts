import {
  Body,
  Controller,
  Delete,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { UploadService } from './upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  DeleteUploadDto,
  UploadFromFileDto,
  UploadFromUrlDto,
} from './dto/upload.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('upload')
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Post('admin/from-file')
  async uploadFromFile(
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: true,
      }),
    )
    file: Express.Multer.File,
    @Body() body: UploadFromFileDto,
  ) {
    return await this.uploadService.uploadFromFile(file, body);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post('admin/from-url')
  async uploadFromUrl(@Body() body: UploadFromUrlDto) {
    return await this.uploadService.uploadFromUrl(body);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Delete('admin')
  async deleteUploads(@Body() body: DeleteUploadDto) {
    return await this.uploadService.deleteUploads(body.upload_ids);
  }
}
