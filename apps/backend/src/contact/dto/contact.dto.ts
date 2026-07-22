import { ApiProperty } from '@nestjs/swagger';
import { ContactStatus } from '../../generated/prisma';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { CommonQueryParamsDto } from '../../common/dto/query-param.dto';
import { Transform } from 'class-transformer';

export class CreateContactDto {
  @ApiProperty({ type: 'string', example: 'example@gmail.com', required: true })
  @IsNotEmpty()
  @IsString()
  user_email!: string;

  @ApiProperty({ type: 'string', required: true })
  @IsNotEmpty()
  @IsString()
  message!: string;
}

export class DeleteContactsDto {
  @ApiProperty({
    example: [1, 2, 3],
    required: true,
    isArray: true,
  })
  @IsNotEmpty()
  @IsArray()
  @IsNumber({ allowNaN: false }, { each: true })
  contact_ids!: number[];
}

export class AnswerContactDto {
  @ApiProperty({ type: 'string', required: true })
  @IsNotEmpty()
  @IsString()
  answer_message!: string;
}

export class RejectContactDto {
  @ApiProperty({ type: 'string', required: false })
  @IsNotEmpty()
  @IsString()
  rejected_detail!: string;
}

export class GetAllContactsDto extends CommonQueryParamsDto {
  @ApiProperty({
    example: ContactStatus.PENDING,
    required: false,
    isArray: false,
  })
  @Transform(({ value }) =>
    typeof value === 'string' ? [value] : !value ? [] : value,
  )
  status?: ContactStatus[];
}


