import { Injectable } from '@nestjs/common';
import { StatsRepository } from './repository/stats.repository';
import { prisma } from '../lib/prisma';
import { AppLanguage, MovieType, UserMovie, UserMovieType } from '../generated/prisma';

@Injectable()
export class StatsService {
  constructor(private readonly statsRepository: StatsRepository) {}

  // async getOverviewStats() {
  //   const result = await prisma.$transaction(async (tx) => {
  //     // cards data
  //     const totalViewsCount = await tx.userMovie.count({
  //       where: {
  //         type: {
  //           in: [UserMovieType.WATCHED, UserMovieType.WATCHING],
  //         },
  //       },
  //     });

  //     const totalUsersCount = await tx.user.count();

  //     const totalSeriesMoviesCount = await tx.movie.count({
  //       where: { type: MovieType.SERIES },
  //     });
  //     const totalCinematicMoviesCount = await tx.movie.count({
  //       where: { type: MovieType.CINEMATIC },
  //     });

  //     const totalWatchTimeSeconds = await tx.userMovie.findMany({
  //       where: {
  //         type: {
  //           in: [UserMovieType.WATCHED, UserMovieType.WATCHING],
  //         },
  //       },
  //     });

  //     const sumTotalWatchTimeSeconds = totalWatchTimeSeconds.reduce(
  //       (sum: number, current: UserMovie) => {
  //         return sum + (current.progress_time ?? 0);
  //       },
  //       0,
  //     );

  //     // chart data
  //     const startOfYear = new Date(new Date().getFullYear(), 0, 1);
  //     const totalWatchTimeSecondsForRecentAYear = await tx.userMovie.findMany({
  //       where: {
  //         updated_at: {
  //           gte: startOfYear,
  //         },
  //         type: {
  //           in: [UserMovieType.WATCHED, UserMovieType.WATCHING],
  //         },
  //       },
  //     });

  //     const watchYearMap = new Map();

  //     totalWatchTimeSecondsForRecentAYear.forEach((data) => {
  //       watchYearMap.set(
  //         data.updated_at.getMonth(),
  //         (watchYearMap.get(data.updated_at.getMonth()) ?? 0) +
  //           (data.progress_time ?? 0),
  //       );
  //     });

  //     const chartData = Array.from({ length: 12 }).map((_, i) => ({
  //       month: i,
  //       total: watchYearMap.get(i) ?? 0,
  //     }));

  //     // table data
  //     const recentRegisteredUsers = await tx.user.findMany({
  //       orderBy: {
  //         created_at: 'desc',
  //       },
  //       take: 10,
  //     });

  //     return {
  //       cards: {
  //         total_views: totalViewsCount,
  //         total_users: totalUsersCount,
  //         total_series: totalSeriesMoviesCount,
  //         total_cinematic: totalCinematicMoviesCount,
  //         total_watch_time_seconds: sumTotalWatchTimeSeconds,
  //       },
  //       chart: chartData,
  //       table: recentRegisteredUsers,
  //     };
  //   });
  //   return result;
  // }

  // async getAnalyticsStats() {
  //   const result = await prisma.$transaction(async (tx) => {
  //     // chart data

  //     const now = new Date();
  //     const day = now.getDay();
  //     const diff = (day + 1) % 7;
  //     const startOfWeek = new Date(now);
  //     startOfWeek.setDate(now.getDate() - diff);
  //     startOfWeek.setHours(0, 0, 0, 0);

  //     const totalLastWeekMoviesPlaysCount = await tx.userMovie.findMany({
  //       where: {
  //         type: { in: [UserMovieType.WATCHING, UserMovieType.WATCHED] },
  //         updated_at: {
  //           gte: startOfWeek,
  //         },
  //       },
  //     });

  //     const watchWeekMap = new Map();

  //     totalLastWeekMoviesPlaysCount.forEach((data) => {
  //       watchWeekMap.set(
  //         data.updated_at.getDay(),
  //         (watchWeekMap.get(data.updated_at.getDay()) ?? 0) + 1,
  //       );
  //     });

  //     const chartData = Array.from({ length: 7 }).map((_, i) => ({
  //       day: i,
  //       total: watchWeekMap.get(i) ?? 0,
  //     }));

  //     console.log(chartData);

  //     ////////
  //     const totalLastWeekUsersPlaysCount = await tx.userMovie.groupBy({
  //       by: ['user_id'],
  //       where: {
  //         type: { in: [UserMovieType.WATCHING, UserMovieType.WATCHED] },
  //         updated_at: { gte: startOfWeek },
  //       },
  //       _count: { _all: true },
  //       orderBy: {
  //         _count: {
  //           user_id: 'desc',
  //         },
  //       },
  //       take: 5,
  //     });
  //     const recentUsersId = totalLastWeekUsersPlaysCount.map(
  //       (user) => user.user_id,
  //     );
  //     const recentUsers = await tx.user.findMany({
  //       where: {
  //         id: { in: recentUsersId },
  //       },
  //     });
  //     const recentUsersWithPlaysCount = recentUsers
  //       .map((user) => {
  //         const playsCount = totalLastWeekUsersPlaysCount.find(
  //           (play) => play.user_id === user.id,
  //         )?._count?._all;
  //         return {
  //           ...user,
  //           plays_count: playsCount ?? 0,
  //         };
  //       })
  //       .sort((a, b) => b.plays_count - a.plays_count);

  //     // cards data
  //     // tables data
  //   });

  //   return [];
  // }

  calcGrowthRate(current: number, previous: number) {
    if (previous === 0) {
      return current > 0 ? 100 : 0;
    }
    return ((current - previous) / previous) * 100;
  }

  async getOverviewStats() {
    const now = new Date();
    const firstDayOfCurrentMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1,
    );

    const firstDayOfLastMonth = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1,
    );
    const lastDayOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    const firstDayOfCurrentYear = new Date(now.getFullYear(), 0, 1);

    const [
      // cards data
      totalViews,
      recentMonthTotalViews,
      lastMonthTotalViews,
      totalUsers,
      recentMonthTotalUsers,
      lastMonthTotalUsers,
      totalSeries,
      totalCinematic,
      recentMonthTotalMovies,
      lastMonthTotalMovies,
      totalProgressTime,
      recentMonthTotalProgressTime,
      lastMonthTotalProgressTime,
      // chart data
      currentYearWatches,
      // recent users list
      recentUsers,
    ] = await Promise.all([
      // views
      prisma.userMovie.count({
        where: {
          type: { in: [UserMovieType.WATCHED, UserMovieType.WATCHING] },
        },
      }),
      prisma.userMovie.count({
        where: {
          type: { in: [UserMovieType.WATCHED, UserMovieType.WATCHING] },
          updated_at: { gte: firstDayOfCurrentMonth, lt: now },
        },
      }),
      prisma.userMovie.count({
        where: {
          type: { in: [UserMovieType.WATCHED, UserMovieType.WATCHING] },
          updated_at: { gte: firstDayOfLastMonth, lt: lastDayOfLastMonth },
        },
      }),
      // users
      prisma.user.count(),
      prisma.user.count({
        where: { created_at: { gte: firstDayOfCurrentMonth, lt: now } },
      }),
      prisma.user.count({
        where: {
          created_at: { gte: firstDayOfLastMonth, lt: lastDayOfLastMonth },
        },
      }),
      // content
      prisma.movie.count({ where: { type: MovieType.SERIES } }),
      prisma.movie.count({ where: { type: MovieType.CINEMATIC } }),
      prisma.movie.count({
        where: { created_at: { gte: firstDayOfCurrentMonth, lt: now } },
      }),
      prisma.movie.count({
        where: {
          created_at: { gte: firstDayOfLastMonth, lt: lastDayOfLastMonth },
        },
      }),
      // watch time
      prisma.userMovie.aggregate({
        where: {
          type: { in: [UserMovieType.WATCHED, UserMovieType.WATCHING] },
        },
        _sum: { progress_time: true },
      }),
      prisma.userMovie.aggregate({
        where: {
          type: { in: [UserMovieType.WATCHED, UserMovieType.WATCHING] },
          updated_at: { gte: firstDayOfCurrentMonth, lt: now },
        },
        _sum: { progress_time: true },
      }),
      prisma.userMovie.aggregate({
        where: {
          type: { in: [UserMovieType.WATCHED, UserMovieType.WATCHING] },
          updated_at: { gte: firstDayOfLastMonth, lt: lastDayOfLastMonth },
        },
        _sum: { progress_time: true },
      }),
      // chart: current year watches (only updated_at needed)
      prisma.userMovie.findMany({
        where: {
          type: { in: [UserMovieType.WATCHED, UserMovieType.WATCHING] },
          updated_at: { gte: firstDayOfCurrentYear },
        },
        select: { updated_at: true },
      }),
      // recent users
      prisma.user.findMany({
        orderBy: { created_at: 'desc' },
        select: {
          id: true,
          created_at: true,
          block_expires_at: true,
          email: true,
          username: true,
          role: true,
        },
        take: 5,
      }),
    ]);

    // growth rates
    const viewsGrowthRate = this.calcGrowthRate(
      recentMonthTotalViews,
      lastMonthTotalViews,
    );
    const usersGrowthRate = this.calcGrowthRate(
      recentMonthTotalUsers,
      lastMonthTotalUsers,
    );
    const totalContent = totalSeries + totalCinematic;
    const moviesGrowthRate = this.calcGrowthRate(
      recentMonthTotalMovies,
      lastMonthTotalMovies,
    );
    const watchProgressGrowth = this.calcGrowthRate(
      recentMonthTotalProgressTime._sum.progress_time ?? 0,
      lastMonthTotalProgressTime._sum.progress_time ?? 0,
    );

    const cardsData = {
      total_views: totalViews,
      view_growth_rate: viewsGrowthRate,
      total_users: totalUsers,
      users_growth_rate: usersGrowthRate,
      total_content: totalContent,
      total_series: totalSeries,
      total_cinematic: totalCinematic,
      movies_growth_rate: moviesGrowthRate,
      total_watch_times: totalProgressTime._sum.progress_time ?? 0,
      watch_progress_growth: watchProgressGrowth,
    };

    // chart data — build month -> count map
    const watchMap = new Map<number, number>();
    currentYearWatches.forEach((userMovie) => {
      const userMovieWatchedMonth = new Date(userMovie.updated_at).getMonth();
      watchMap.set(
        userMovieWatchedMonth,
        (watchMap.get(userMovieWatchedMonth) ?? 0) + 1,
      );
    });

    const currentYearWatchData = Array.from({ length: 12 }).map((_, i) => ({
      month: i,
      total: watchMap.get(i) ?? 0,
    }));

    return {
      cards_data: cardsData,
      current_year_watch_data: currentYearWatchData,
      recent_users: recentUsers,
    };
  }

  async getAnalyticsStats() {
    const now = new Date();

    const day = now.getDay();
    const diff = (day + 1) % 7;

    const startOfCurrentWeek = new Date(now);
    startOfCurrentWeek.setDate(now.getDate() - diff);
    startOfCurrentWeek.setHours(0, 0, 0, 0);

    const startOfLastWeek = new Date(startOfCurrentWeek);
    startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);

    const endOfLastWeek = new Date(startOfCurrentWeek);
    endOfLastWeek.setMilliseconds(-1);

    const [
      recentWeekTotalViews,
      lastWeekTotalViews,
      recentWeekUniqueUsers,
      lastWeekUniqueUsers,
      recentWeekTotalWatchedMovies,
      recentWeekTotalPlayedMovies,
      lastWeekTotalWatchedMovies,
      lastWeekTotalPlayedMovies,
      recentWeekProgressAvgResult,
      lastWeekProgressAvgResult,
      currentWeekPlays,
      topMovieAggs,
    ] = await Promise.all([
      prisma.userMovie.count({
        where: {
          type: { in: [UserMovieType.WATCHED, UserMovieType.WATCHING] },
          updated_at: { gte: startOfCurrentWeek, lt: now },
        },
      }),
      prisma.userMovie.count({
        where: {
          type: { in: [UserMovieType.WATCHED, UserMovieType.WATCHING] },
          updated_at: { gte: startOfLastWeek, lt: endOfLastWeek },
        },
      }),
      prisma.userMovie.groupBy({
        by: ['user_id'],
        where: {
          type: { in: [UserMovieType.WATCHED, UserMovieType.WATCHING] },
          updated_at: { gte: startOfCurrentWeek, lt: now },
        },
        _count: { user_id: true },
      }),
      prisma.userMovie.groupBy({
        by: ['user_id'],
        where: {
          type: { in: [UserMovieType.WATCHED, UserMovieType.WATCHING] },
          updated_at: { gte: startOfLastWeek, lt: endOfLastWeek },
        },
        _count: { user_id: true },
      }),
      prisma.userMovie.count({
        where: {
          type: UserMovieType.WATCHED,
          updated_at: { gte: startOfCurrentWeek, lt: now },
        },
      }),
      prisma.userMovie.count({
        where: {
          type: { in: [UserMovieType.WATCHED, UserMovieType.WATCHING] },
          updated_at: { gte: startOfCurrentWeek, lt: now },
        },
      }),
      prisma.userMovie.count({
        where: {
          type: UserMovieType.WATCHED,
          updated_at: { gte: startOfLastWeek, lt: endOfLastWeek },
        },
      }),
      prisma.userMovie.count({
        where: {
          type: { in: [UserMovieType.WATCHED, UserMovieType.WATCHING] },
          updated_at: { gte: startOfLastWeek, lt: endOfLastWeek },
        },
      }),
      prisma.userMovie.aggregate({
        where: {
          type: { in: [UserMovieType.WATCHED, UserMovieType.WATCHING] },
          updated_at: { gte: startOfCurrentWeek, lt: now },
        },
        _avg: { progress_time: true },
      }),
      prisma.userMovie.aggregate({
        where: {
          type: { in: [UserMovieType.WATCHED, UserMovieType.WATCHING] },
          updated_at: { gte: startOfLastWeek, lt: endOfLastWeek },
        },
        _avg: { progress_time: true },
      }),
      prisma.userMovie.findMany({
        where: {
          type: { in: [UserMovieType.WATCHED, UserMovieType.WATCHING] },
          updated_at: { gte: startOfCurrentWeek, lt: now },
        },
        select: { user_id: true, updated_at: true, movie_id: true },
      }),
      prisma.userMovie.groupBy({
        by: ['movie_id'],
        where: {
          type: { in: [UserMovieType.WATCHED, UserMovieType.WATCHING] },
          updated_at: { gte: startOfCurrentWeek, lt: now },
          movie_id: { not: null },
        },
        _count: { movie_id: true },
        orderBy: { _count: { movie_id: 'desc' } },
        take: 5,
      }),
    ]);

    const viewsGrowthRate = this.calcGrowthRate(
      recentWeekTotalViews,
      lastWeekTotalViews,
    );

    const recentWeekUniqueViewersCount = recentWeekUniqueUsers.length;
    const lastWeekUniqueViewersCount = lastWeekUniqueUsers.length;
    const uniqueViewersGrowthRate = this.calcGrowthRate(
      recentWeekUniqueViewersCount,
      lastWeekUniqueViewersCount,
    );

    const recentWeekCompletionRate =
      recentWeekTotalPlayedMovies > 0
        ? (recentWeekTotalWatchedMovies / recentWeekTotalPlayedMovies) * 100
        : 0;

    const lastWeekCompletionRate =
      lastWeekTotalPlayedMovies > 0
        ? (lastWeekTotalWatchedMovies / lastWeekTotalPlayedMovies) * 100
        : 0;

    const completionRateGrowth = this.calcGrowthRate(
      recentWeekCompletionRate,
      lastWeekCompletionRate,
    );

    const recentWeekProgressAvg =
      recentWeekProgressAvgResult._avg.progress_time ?? 0;
    const lastWeekProgressAvg =
      lastWeekProgressAvgResult._avg.progress_time ?? 0;

    const progressGrowthRate = this.calcGrowthRate(
      recentWeekProgressAvg,
      lastWeekProgressAvg,
    );

    const dayMap = new Map<
      number,
      { total_plays: number; viewerSet: Set<number> }
    >();
    for (let i = 0; i < 7; i++) {
      dayMap.set(i, { total_plays: 0, viewerSet: new Set() });
    }

    currentWeekPlays.forEach((record) => {
      const dayIndex = (record.updated_at.getDay() + 1) % 7;
      const entry = dayMap.get(dayIndex)!;
      entry.total_plays++;
      entry.viewerSet.add(record.user_id);
    });

    const chartData = Array.from({ length: 7 }).map((_, i) => ({
      day: i,
      total_plays: dayMap.get(i)!.total_plays,
      unique_viewers: dayMap.get(i)!.viewerSet.size,
    }));

    const topMovieIds = topMovieAggs
      .map((m) => m.movie_id!)
      .filter(Boolean);
    const topMoviePlaysMap = new Map(
      topMovieAggs.map((m) => [m.movie_id!, m._count.movie_id]),
    );

    const allPlayedMovieIds = [
      ...new Set(
        currentWeekPlays
          .filter((p) => p.movie_id)
          .map((p) => p.movie_id!),
      ),
    ];

    const movieTranslations: { movie_id: number; title: string }[] =
      topMovieIds.length > 0
        ? await prisma.movieTranslation.findMany({
            where: {
              movie_id: { in: topMovieIds },
              language: AppLanguage.EN,
            },
            select: { movie_id: true, title: true },
          })
        : [];

    const movieGenres: { genre_id: number; movie_id: number }[] =
      allPlayedMovieIds.length > 0
        ? await prisma.movieGenre.findMany({
            where: { movie_id: { in: allPlayedMovieIds } },
            select: { genre_id: true, movie_id: true },
          })
        : [];

    const moviePlayCountMap = new Map<number, number>();
    currentWeekPlays.forEach((p) => {
      if (p.movie_id) {
        moviePlayCountMap.set(
          p.movie_id,
          (moviePlayCountMap.get(p.movie_id) ?? 0) + 1,
        );
      }
    });

    const genrePlayCountMap = new Map<number, number>();
    movieGenres.forEach((mg) => {
      const plays = moviePlayCountMap.get(mg.movie_id) ?? 0;
      genrePlayCountMap.set(
        mg.genre_id,
        (genrePlayCountMap.get(mg.genre_id) ?? 0) + plays,
      );
    });

    const topGenreIds = [...genrePlayCountMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([id]) => id);

    const genreTranslations: { genre_id: number; name: string }[] =
      topGenreIds.length > 0
        ? await prisma.genreTranslation.findMany({
            where: {
              genre_id: { in: topGenreIds },
              language: AppLanguage.EN,
            },
            select: { genre_id: true, name: true },
          })
        : [];

    const topMovies = topMovieIds.map((id) => ({
      id,
      title: movieTranslations.find((t) => t.movie_id === id)?.title ?? '',
      plays_count: topMoviePlaysMap.get(id) ?? 0,
    }));

    const topGenres = topGenreIds.map((id) => ({
      id,
      name: genreTranslations.find((t) => t.genre_id === id)?.name ?? '',
      plays_count: genrePlayCountMap.get(id) ?? 0,
    }));

    return {
      cards_data: {
        total_plays: recentWeekTotalViews,
        total_plays_growth: viewsGrowthRate,
        unique_viewers: recentWeekUniqueViewersCount,
        unique_viewers_growth: uniqueViewersGrowthRate,
        completion_rate: recentWeekCompletionRate,
        completion_rate_growth: completionRateGrowth,
        avg_watch_time: recentWeekProgressAvg,
        avg_watch_time_growth: progressGrowthRate,
      },
      current_week_chart_data: chartData,
      top_movies: topMovies,
      top_genres: topGenres,
    };
  }
}
