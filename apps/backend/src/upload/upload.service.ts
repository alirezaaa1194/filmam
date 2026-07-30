import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { UploadFromFileDto, UploadFromUrlDto } from './dto/upload.dto';
import { UploadRepository } from './repository/upload.repository';

@Injectable()
export class UploadService {
  constructor(private uploadRepository: UploadRepository) {}
  private supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!,
  );

  async uploadFromFile(file: Express.Multer.File, body: UploadFromFileDto) {
    const bucket = process.env.SUPABASE_BUCKET!;
    const fileName = `${Date.now()}-${file.originalname}`;
    const filePath = `files/${fileName}`;

    const { error } = await this.supabase.storage
      .from(bucket)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });
      
    if (error) throw new InternalServerErrorException(error.message);

    const { data: publicUrlData } = this.supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return await this.uploadRepository.createUploadFromFile({
      file,
      body,
      fileName,
      publicUrl: publicUrlData.publicUrl,
    });
  }

  async uploadFromUrl(body: UploadFromUrlDto) {
    const response = await fetch(body.path);
    if (!response.ok) {
      throw new BadRequestException('Failed to fetch file from the provided URL');
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const contentType = response.headers.get('content-type') || body.mime_type;
    const bucket = process.env.SUPABASE_BUCKET!;
    let fileName = `url-${Date.now()}`;

    const contentDisposition = response.headers.get('content-disposition');
    if (contentDisposition) {
      const match = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      if (match) fileName = `${Date.now()}-${match[1].replace(/['"]/g, '')}`;
    } else {
      const segments = body.path.split('/');
      const last = segments[segments.length - 1];
      if (last && last.includes('.')) fileName = `${Date.now()}-${last}`;
    }

    const filePath = `files/${fileName}`;

    const { error } = await this.supabase.storage.from(bucket).upload(filePath, buffer, {
      contentType,
      upsert: false,
    });
    if (error) throw new ForbiddenException('Upload failed');

    const { data: publicUrlData } = this.supabase.storage.from(bucket).getPublicUrl(filePath);

    return await this.uploadRepository.createUploadFromFile({
      file: {
        originalname: fileName,
        mimetype: contentType,
        size: buffer.length,
        buffer,
      } as Express.Multer.File,
      body,
      fileName,
      publicUrl: publicUrlData.publicUrl,
    });
  }

  async deleteUploads(uploadIds: number[]) {
    const uploads = await this.uploadRepository.getUploads(uploadIds);

    const fileUploads = uploads.filter(
      (upload) => upload.file_name && upload.source_type === 'FROM_FILE',
    );

    if (fileUploads.length > 0) {
      const uploadNames = fileUploads.map(
        (upload) => `files/${upload.file_name}`,
      );

      const { error } = await this.supabase.storage
        .from(process.env.SUPABASE_BUCKET!)
        .remove(uploadNames);

      if (error) {
        throw new Error('Failed to delete files from storage');
      }
    }

    await this.uploadRepository.deleteUploads(uploadIds);

    return {
      message: 'Uploads deleted successfully',
    };
  }

  async findById(uploadId: number) {
    return await this.uploadRepository.findById(uploadId);
  }

  async getUploads(uploadIds: number[]) {
    return await this.uploadRepository.getUploads(uploadIds);
  }
}
