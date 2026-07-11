import { Injectable } from '@nestjs/common';
import { StatsRepository } from './repository/stats.repository';
import { prisma } from '../lib/prisma';
import { MovieType, UserMovie, UserMovieType } from '../generated/prisma';

@Injectable()
export class StatsService {
  constructor(private readonly statsRepository: StatsRepository) {}

  async getOverviewStats() {
    const result = await prisma.$transaction(async (tx) => {
      // cards data
      const totalViewsCount = await tx.userMovie.count({
        where: {
          type: {
            in: [UserMovieType.WATCHED, UserMovieType.WATCHING],
          },
        },
      });

      const totalUsersCount = await tx.user.count();

      const totalSeriesMoviesCount = await tx.movie.count({
        where: { type: MovieType.SERIES },
      });
      const totalCinematicMoviesCount = await tx.movie.count({
        where: { type: MovieType.CINEMATIC },
      });

      const totalWatchTimeSeconds = await tx.userMovie.findMany({
        where: {
          type: {
            in: [UserMovieType.WATCHED, UserMovieType.WATCHING],
          },
        },
      });
      const sumTotalWatchTimeSeconds = totalWatchTimeSeconds.reduce(
        (sum: number, current: UserMovie) => {
          return sum + (current.progress_time ?? 0);
        },
        0,
      );

      // chart data
      const startOfYear = new Date(new Date().getFullYear(), 0, 1);
      const totalWatchTimeSecondsForRecentAYear = await tx.userMovie.findMany({
        where: {
          updated_at: {
            gte: startOfYear,
          },
          type: {
            in: [UserMovieType.WATCHED, UserMovieType.WATCHING],
          },
        },
      });

      const watchYearMap = new Map();

      totalWatchTimeSecondsForRecentAYear.forEach((data) => {
        watchYearMap.set(
          data.updated_at.getMonth(),
          (watchYearMap.get(data.updated_at.getMonth()) ?? 0) +
            (data.progress_time ?? 0),
        );
      });

      const chartData = Array.from({ length: 12 }).map((_, i) => ({
        month: i,
        total: watchYearMap.get(i) ?? 0,
      }));

      // table data
      const recentRegisteredUsers = await tx.user.findMany({
        orderBy: {
          created_at: 'desc',
        },
        take: 10,
      });

      return {
        cards: {
          total_views: totalViewsCount,
          total_users: totalUsersCount,
          total_content: {
            series: totalSeriesMoviesCount,
            cinematic: totalCinematicMoviesCount,
          },
          total_watch_time_seconds: sumTotalWatchTimeSeconds,
        },
        chart: chartData,
        table: recentRegisteredUsers,
      };
    });
    return result;
  }

  async getAnalyticsStats() {}
}
