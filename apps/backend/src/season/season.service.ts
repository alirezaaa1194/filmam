import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSeasonDto, GetAllSeasonsDto } from './dto/season.dto';
import { prisma } from '../lib/prisma';
import { SeasonRepository } from './repository/season.repository';
import { SeasonTranslationService } from '../season-translation/season-translation.service';
import { SeasonFileService } from '../season-file/season-file.service';
import { MovieService } from '../movie/movie.service';
import { defaultLang, paginationCalculator } from '../lib/utils';
import { SortType } from '../common/enums';
import { CommonQueryParamsDto } from '../common/dto/query-param.dto';
import { UserMovieService } from '../user-movie/user-movie.service';

@Injectable()
export class SeasonService {
  constructor(
    private readonly seasonRepository: SeasonRepository,
    private readonly seasonTranslationService: SeasonTranslationService,
    private readonly seasonFileService: SeasonFileService,
    private readonly movieService: MovieService,
    private readonly userMovieService: UserMovieService,
  ) {}
  async createSeason(body: CreateSeasonDto) {
    const result = await prisma.$transaction(async (tx) => {
      const movie = await this.movieService.getMovieDetailAdmin(
        body.movie_id,
        tx,
      );

      if (movie?.type !== 'SERIES') {
        throw new BadRequestException('Movie type must be SERIES');
      }

      const { translations, files, ...otherBodyData } = body;
      const createdSeason = await this.seasonRepository.createSeason(
        otherBodyData,
        tx,
      );
      const seasonTranslationsData = translations.map((seasonTranslation) => {
        return {
          ...seasonTranslation,
          season_id: createdSeason.id,
        };
      });
      const seasonFilesData = files.map((seasonFile) => {
        return {
          ...seasonFile,
          season_id: createdSeason.id,
        };
      });
      await this.seasonTranslationService.createSeasonTranslations(
        seasonTranslationsData,
        tx,
      );
      await this.seasonFileService.createSeasonFiles(seasonFilesData, tx);

      return createdSeason;
    });
    return result;
  }

  async updateSeason(season_id: number, body: CreateSeasonDto) {
    const result = await prisma.$transaction(async (tx) => {
      const { translations, files, ...otherBodyData } = body;
      const updatedSeason = await this.seasonRepository.updateSeason(
        otherBodyData,
        season_id,
        tx,
      );
      const seasonTranslationsData = translations.map((seasonTranslation) => {
        return {
          ...seasonTranslation,
          season_id: updatedSeason.id,
        };
      });
      const seasonFilesData = files.map((seasonFile) => {
        return {
          ...seasonFile,
          season_id: updatedSeason.id,
        };
      });
      await this.seasonTranslationService.updateSeasonTranslations(
        seasonTranslationsData,
        season_id,
        tx,
      );
      await this.seasonFileService.updateSeasonFiles(
        seasonFilesData,
        season_id,
        tx,
      );

      return updatedSeason;
    });
    return result;
  }

  async deleteSeasons(seasonIds: number[]) {
    const result = await prisma.$transaction(async (tx) => {
      return await this.seasonRepository.deleteSeasons(seasonIds, tx);
    });
    return result;
  }

  async getSeasonDetail(seasonId: number) {
    const season = await this.seasonRepository.getSeasonDetail(seasonId);

    if (season) {
      const { files, _count, movie, ...otherSeasonData } = season;
      const seasonFiles = files.map((file) => {
        return { ...file.upload, type: file.type };
      });
      return {
        ...otherSeasonData,
        movie,
        episodes_count: _count.episodes,
        files: seasonFiles,
      };
    } else {
      throw new NotFoundException('season was not found');
    }
  }

  async getAllSeasons(query: GetAllSeasonsDto) {
    const { page, page_size } = paginationCalculator(
      query.page || 1,
      query.page_size || 10,
    );
    const seasons = await this.seasonRepository.getAllSeasons({
      page,
      page_size,
      search: query.search?.trim() || '',
      lang: query.lang || defaultLang,
      sort_type: query.sort === SortType.ASC ? 'asc' : 'desc',
    });

    const normalizedSeasons = seasons.map((season) => {
      const { translations, files, movie, _count, ...otherSeasonData } = season;

      const seasonFiles = files.map((file) => {
        return { ...file.upload, type: file.type };
      });

      const seasonsTranslation = translations[0];
      return {
        ...otherSeasonData,
        movie_title: movie.translations[0].title,
        title: seasonsTranslation.title,
        files: seasonFiles,
        episodes_count: _count.episodes,
      };
    });
    const seasonsCount = await this.seasonRepository.getSeasonsCount(
      query.search?.trim(),
    );
    return {
      page: page + 1,
      page_size,
      count: seasonsCount,
      data: normalizedSeasons,
    };
  }

  async getSeasonEpisodes(
    query: CommonQueryParamsDto,
    seasonSlug: string,
    userId?: number,
  ) {
    const { page, page_size } = paginationCalculator(
      query.page || 1,
      query.page_size || 10,
    );
    const seasonEpisodes = await this.seasonRepository.getSeasonEpisodes(
      {
        page,
        page_size,
        search: '',
        lang: query.lang || defaultLang,
        sort_type: query.sort === SortType.ASC ? 'asc' : 'desc',
      },
      seasonSlug,
    );

    const seasonUserMovieEpisodesMap = new Map();
    if (userId) {
      const seasonUserMovieEpisodes =
        await this.userMovieService.getUserWatchEpisodes(userId);

      seasonUserMovieEpisodes.forEach((seasonUserMovieEpisode) => {
        seasonUserMovieEpisodesMap.set(
          seasonUserMovieEpisode.episode_id,
          seasonUserMovieEpisode,
        );
      });
    }

    const normalizedEpisodes = seasonEpisodes.map((seasonEpisode) => {
      const { translations, movie, season, files, ...otherEpisodeData } =
        seasonEpisode;

      const userEpisode = seasonUserMovieEpisodesMap.get(seasonEpisode.id);

      const seasonFiles = files.map((file) => ({
        type: file.type,
        ...file.upload,
      }));

      return {
        ...otherEpisodeData,
        title: translations[0].title,
        movie_title: movie.translations[0].title,
        season_title: season.translations[0].title,
        movie_season_count: movie._count.seasons,
        watch_progress_time: userEpisode ? userEpisode.progress_time : 0,
        files: seasonFiles,
      };
    });
    const seasonEpisodesCount =
      await this.seasonRepository.getSeasonEpisodesCount(seasonSlug);
    return {
      page: page + 1,
      page_size,
      count: seasonEpisodesCount,
      data: normalizedEpisodes,
    };
  }
}
