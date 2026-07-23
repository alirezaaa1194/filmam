import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../../generated/prisma';

class CardsDataDto {
  @ApiProperty({ example: 1500 })
  total_views!: number;

  @ApiProperty({ example: 12.5 })
  view_growth_rate!: number;

  @ApiProperty({ example: 300 })
  total_users!: number;

  @ApiProperty({ example: 8.3 })
  users_growth_rate!: number;

  @ApiProperty({ example: 120 })
  total_content!: number;

  @ApiProperty({ example: 45 })
  total_series!: number;

  @ApiProperty({ example: 75 })
  total_cinematic!: number;

  @ApiProperty({ example: 15.2 })
  movies_growth_rate!: number;

  @ApiProperty({ example: 50000 })
  total_watch_times!: number;

  @ApiProperty({ example: 10.1 })
  watch_progress_growth!: number;
}

class MonthlyWatchDataDto {
  @ApiProperty({ example: 0 })
  month!: number;

  @ApiProperty({ example: 120 })
  total!: number;
}

class RecentUserDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  created_at!: Date;

  @ApiPropertyOptional()
  block_expires_at?: Date | null;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  username!: string;

  @ApiProperty({ enum: UserRole })
  role!: UserRole;
}

export class OverviewStatsDto {
  @ApiProperty({ type: CardsDataDto })
  cards_data!: CardsDataDto;

  @ApiProperty({ type: [MonthlyWatchDataDto] })
  current_year_watch_data!: MonthlyWatchDataDto[];

  @ApiProperty({ type: [RecentUserDto] })
  recent_users!: RecentUserDto[];
}

class AnalyticsCardsDataDto {
  @ApiProperty({ example: 350 })
  total_plays!: number;

  @ApiProperty({ example: 5.2 })
  total_plays_growth!: number;

  @ApiProperty({ example: 80 })
  unique_viewers!: number;

  @ApiProperty({ example: 3.1 })
  unique_viewers_growth!: number;

  @ApiProperty({ example: 45.5 })
  completion_rate!: number;

  @ApiProperty({ example: -2.3 })
  completion_rate_growth!: number;

  @ApiProperty({ example: 1200 })
  avg_watch_time!: number;

  @ApiProperty({ example: 7.8 })
  avg_watch_time_growth!: number;
}

class WeeklyChartDataDto {
  @ApiProperty({ example: 0 })
  day!: number;

  @ApiProperty({ example: 50 })
  total_plays!: number;

  @ApiProperty({ example: 30 })
  unique_viewers!: number;
}

class TopMovieDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  plays_count!: number;
}

class TopGenreDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  plays_count!: number;
}

export class AnalyticsStatsDto {
  @ApiProperty({ type: AnalyticsCardsDataDto })
  cards_data!: AnalyticsCardsDataDto;

  @ApiProperty({ type: [WeeklyChartDataDto] })
  current_week_chart_data!: WeeklyChartDataDto[];

  @ApiProperty({ type: [TopMovieDto] })
  top_movies!: TopMovieDto[];

  @ApiProperty({ type: [TopGenreDto] })
  top_genres!: TopGenreDto[];
}

export class SummaryStatsDto {
  @ApiProperty({ example: 5 })
  comments!: number;

  @ApiProperty({ example: 3 })
  contacts!: number;
}