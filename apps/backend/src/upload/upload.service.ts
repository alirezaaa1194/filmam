import { ForbiddenException, Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { UploadFromFileDto, UploadFromUrlDto } from './dto/upload.dto';
import { UploadRepository } from './upload.repository';

@Injectable()
export class UploadService {
  constructor(private uploadRepository: UploadRepository) {}
  private supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!,
  );

  async uploadFromFile(file: Express.Multer.File, body: UploadFromFileDto) {
    const bucket = process.env.SUPABASE_BUCKET!;
    const filePath = `files/${Date.now()}-${file.originalname}`;

    const { error } = await this.supabase.storage
      .from(bucket)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });
    if (error) throw new ForbiddenException();
    const { data: publicUrlData } = this.supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return await this.uploadRepository.createUploadFromFile({
      file,
      body,
      publicUrl: publicUrlData.publicUrl,
    });
  }

  async uploadFromUrl(body: UploadFromUrlDto) {
    return await this.uploadRepository.createUploadFromUrl(body);
  }
}
