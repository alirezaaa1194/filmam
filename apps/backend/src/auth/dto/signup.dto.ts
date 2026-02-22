import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class SignUpDto {
  @ApiProperty({
    description: 'username',
    required: true,
  })
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'user email',
    required: true,
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '12345678',
    description: 'user password',
    required: true,
  })
  @MinLength(8)
  password: string;
}
