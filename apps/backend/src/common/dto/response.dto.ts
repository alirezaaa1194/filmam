import { ApiProperty } from '@nestjs/swagger';

export class CountResponseDto {
  @ApiProperty({ example: 0 })
  count!: number;
}

export class MessageResponseDto {
  @ApiProperty({ example: 'Operation completed successfully' })
  message!: string;
}

export class TokenResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIs...' })
  accessToken!: string;

  @ApiProperty({ example: 2592000 })
  accessTokenExpiresIn!: number;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIs...' })
  refreshToken!: string;

  @ApiProperty({ example: 2592000 })
  refreshTokenExpiresIn!: number;
}

export class PaginationMetaDto {
  @ApiProperty({ example: 1 })
  page!: number;

  @ApiProperty({ example: 10 })
  page_size!: number;

  @ApiProperty({ example: 100 })
  count!: number;
}
