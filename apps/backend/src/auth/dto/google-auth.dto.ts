import { IsEmail, IsNotEmpty } from 'class-validator';

export class GoogleAuthDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  google_id: string;
}
