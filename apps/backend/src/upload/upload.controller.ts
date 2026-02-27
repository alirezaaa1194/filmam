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
import { Admin } from '../common/decorators/role.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { UploadService } from './upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  DeleteUploadDto,
  UploadFromFileDto,
  UploadFromUrlDto,
} from './dto/upload.dto';

@Controller('upload')
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Admin()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Post('from-file')
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

  @Admin()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post('from-url')
  async uploadFromUrl(@Body() body: UploadFromUrlDto) {
    return await this.uploadService.uploadFromUrl(body);
  }

  @Admin()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Delete()
  async deleteUploads(@Body() body: DeleteUploadDto) {
    return await this.uploadService.deleteUploads(body.uploadIds);
  }
}
