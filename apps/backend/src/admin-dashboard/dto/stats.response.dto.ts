import { ApiProperty } from '@nestjs/swagger';

export class OverviewStatsDto {
  @ApiProperty({ example: 150 })
  total_users!: number;

  @ApiProperty({ example: 45 })
  total_movies!: number;

  @ApiProperty({ example: 12 })
  total_series!: number;

  @ApiProperty({ example: 320 })
  total_comments!: number;

  @ApiProperty({ example: 80 })
  total_factors!: number;

  @ApiProperty({ example: 10 })
  total_genres!: number;
}

export class AnalyticsPointDto {
  @ApiProperty()
  date!: string;

  @ApiProperty()
  value!: number;
}

export class AnalyticsStatsDto {
  @ApiProperty({ type: [AnalyticsPointDto] })
  users!: AnalyticsPointDto[];

  @ApiProperty({ type: [AnalyticsPointDto] })
  movies!: AnalyticsPointDto[];

  @ApiProperty({ type: [AnalyticsPointDto] })
  comments!: AnalyticsPointDto[];
}

export class SummaryStatsDto {
  @ApiProperty()
  total_users!: number;

  @ApiProperty()
  total_movies!: number;

  @ApiProperty()
  total_episodes!: number;

  @ApiProperty()
  total_comments!: number;

  @ApiProperty()
  total_views!: number;

  @ApiProperty()
  total_likes!: number;
}
