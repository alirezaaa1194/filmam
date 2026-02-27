import { Injectable } from '@nestjs/common';
import { prisma } from '../../lib/prisma';
import { UploadFromFileDto, UploadFromUrlDto } from '../dto/upload.dto';
import { SourceType } from '@prisma/client';

@Injectable()
export class UploadRepository {
  async createUploadFromFile({
    file,
    body,
    fileName,
    publicUrl,
  }: {
    file: Express.Multer.File;
    body: UploadFromFileDto;
    fileName: string;
    publicUrl: string;
  }) {
    return await prisma.upload.create({
      data: {
        file_name: fileName,
        mime_type: file.mimetype,
        path: publicUrl,
        size: file.size,
        width: body.width,
        height: body.height,
        duration: body.duration,
        source_type: SourceType.FROM_FILE,
      },
    });
  }

  async createUploadFromUrl(body: UploadFromUrlDto) {
    return await prisma.upload.create({
      data: {
        file_name: String(Date.now()),
        mime_type: body.mimeType,
        path: body.path,
        width: body.width,
        height: body.height,
        duration: body.duration,
        source_type: SourceType.FROM_URL,
      },
    });
  }
  
  async getUploads(uploadIds: number[]) {
    return await prisma.upload.findMany({
      where: {
        id: {
          in: uploadIds,
        },
      },
    });
  }

  async deleteUploads(uploadIds: number[]) {
    return await prisma.upload.deleteMany({
      where: {
        id: {
          in: uploadIds,
        },
      },
    });
  }
}
