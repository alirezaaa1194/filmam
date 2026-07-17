import { Injectable } from '@nestjs/common';
import { MovieType, UserMovieType } from '../generated/prisma';
import { GetAnalyticsStatsDto } from './dto/stats.dto';
import { UserRepository } from '../user/repository/user.repository';
import { MovieRepository } from '../movie/repository/movie.repository';
import { UserMovieRepository } from '../user-movie/repository/user-movie.repository';
import { MovieTranslationRepository } from '../movie-translation/repository/movie-translation.repository';
import { MovieGenreRepository } from '../movie-genre/repository/movie-genre.repository';
import { GenreTranslationRepository } from '../genre-translation/repository/genre-translation.repository';

@Injectable()
export class StatsService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly movieRepository: MovieRepository,
    private readonly userMovieRepository: UserMovieRepository,
    private readonly movieTranslationRepository: MovieTranslationRepository,
    private readonly movieGenreRepository: MovieGenreRepository,
    private readonly genreTranslationRepository: GenreTranslationRepository,
  ) {}

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

    const watchedTypes = [UserMovieType.WATCHED, UserMovieType.WATCHING];

    const [
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
      currentYearWatches,
      recentUsers,
    ] = await Promise.all([
      this.userMovieRepository.countViews(watchedTypes),
      this.userMovieRepository.countViews(
        watchedTypes,
        firstDayOfCurrentMonth,
        now,
      ),
      this.userMovieRepository.countViews(
        watchedTypes,
        firstDayOfLastMonth,
        lastDayOfLastMonth,
      ),
      this.userRepository.getUsersCount(),
      this.userRepository.getUsersCreatedBetween(firstDayOfCurrentMonth, now),
      this.userRepository.getUsersCreatedBetween(
        firstDayOfLastMonth,
        lastDayOfLastMonth,
      ),
      this.movieRepository.countMoviesByType(MovieType.SERIES),
      this.movieRepository.countMoviesByType(MovieType.CINEMATIC),
      this.movieRepository.countMoviesCreatedBetween(
        firstDayOfCurrentMonth,
        now,
      ),
      this.movieRepository.countMoviesCreatedBetween(
        firstDayOfLastMonth,
        lastDayOfLastMonth,
      ),
      this.userMovieRepository.aggregateProgressSum(watchedTypes),
      this.userMovieRepository.aggregateProgressSum(
        watchedTypes,
        firstDayOfCurrentMonth,
        now,
      ),
      this.userMovieRepository.aggregateProgressSum(
        watchedTypes,
        firstDayOfLastMonth,
        lastDayOfLastMonth,
      ),
      this.userMovieRepository.findCurrentYearWatches(
        watchedTypes,
        firstDayOfCurrentYear,
      ),
      this.userRepository.getRecentUsers(5),
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

  async getAnalyticsStats(query: GetAnalyticsStatsDto) {
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

    const watchedTypes = [UserMovieType.WATCHED, UserMovieType.WATCHING];

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
      this.userMovieRepository.countViews(
        watchedTypes,
        startOfCurrentWeek,
        now,
      ),
      this.userMovieRepository.countViews(
        watchedTypes,
        startOfLastWeek,
        endOfLastWeek,
      ),
      this.userMovieRepository.groupUniqueViewers(
        watchedTypes,
        startOfCurrentWeek,
        now,
      ),
      this.userMovieRepository.groupUniqueViewers(
        watchedTypes,
        startOfLastWeek,
        endOfLastWeek,
      ),
      this.userMovieRepository.countCompletedViews(startOfCurrentWeek, now),
      this.userMovieRepository.countViews(
        watchedTypes,
        startOfCurrentWeek,
        now,
      ),
      this.userMovieRepository.countCompletedViews(
        startOfLastWeek,
        endOfLastWeek,
      ),
      this.userMovieRepository.countViews(
        watchedTypes,
        startOfLastWeek,
        endOfLastWeek,
      ),
      this.userMovieRepository.aggregateProgressAvg(
        watchedTypes,
        startOfCurrentWeek,
        now,
      ),
      this.userMovieRepository.aggregateProgressAvg(
        watchedTypes,
        startOfLastWeek,
        endOfLastWeek,
      ),
      this.userMovieRepository.findWeekPlays(
        watchedTypes,
        startOfCurrentWeek,
        now,
      ),
      this.userMovieRepository.groupTopMovies(
        watchedTypes,
        startOfCurrentWeek,
        now,
        5,
      ),
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

    const topMovieIds = topMovieAggs.map((m) => m.movie_id!).filter(Boolean);
    const topMoviePlaysMap = new Map(
      topMovieAggs.map((m) => [m.movie_id!, m._count.movie_id]),
    );

    const allPlayedMovieIds = [
      ...new Set(
        currentWeekPlays.filter((p) => p.movie_id).map((p) => p.movie_id!),
      ),
    ];

    const movieTranslations: { movie_id: number; title: string }[] =
      topMovieIds.length > 0
        ? await this.movieTranslationRepository.findByMovieIds(
            topMovieIds,
            query.lang,
          )
        : [];

    const movieGenres: { genre_id: number; movie_id: number }[] =
      allPlayedMovieIds.length > 0
        ? await this.movieGenreRepository.findByMovieIds(allPlayedMovieIds)
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
        ? await this.genreTranslationRepository.findByGenreIds(
            topGenreIds,
            query.lang,
          )
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
