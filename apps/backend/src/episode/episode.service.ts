import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateEpisodeDto,
  GetAllEpisodesDto,
  GetEpisodeDetailPublicDto,
} from './dto/episode.dto';
import { prisma } from '../lib/prisma';
import { EpisodeRepository } from './repository/episode.repository';
import { EpisodeTranslationService } from '../episode-translation/episode-translation.service';
import { EpisodeFileService } from '../episode-file/episode-file.service';
import {
  defaultLang,
  normalizeMovieDetail,
  paginationCalculator,
} from '../lib/utils';
import { SortType } from '../common/enums';
import { AppLanguage, EpisodeFileType, MovieType } from '../generated/prisma';
import { TransactionType } from '../common/types/types';
import { UploadService } from '../upload/upload.service';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class EpisodeService {
  constructor(
    private readonly episodeRepository: EpisodeRepository,
    private readonly episodeTranslationService: EpisodeTranslationService,
    private readonly episodeFileService: EpisodeFileService,
    private readonly uploadService: UploadService,
    private readonly notificationService: NotificationService,
  ) {}

  async handleSendNotification(body: CreateEpisodeDto) {
    const season = await this.episodeRepository.findSeasonWithMovie(
      body.season_id,
    );

    if (!season || !season.movie_id) {
      return;
    }

    const usersNotificationMovies =
      await this.episodeRepository.findNotificationUserMovies(season.movie_id);

    const usersId = usersNotificationMovies.map(
      (usersNotificationMovie) => usersNotificationMovie.user_id,
    );

    const { translations, files } = body;

    let imagePath: null | string = null;

    const posterFile = files.find((f) => f.type === EpisodeFileType.POSTER);

    if (posterFile) {
      const posterFileUploadData = await this.uploadService.getUploads([
        posterFile.upload_id,
      ]);
      imagePath = posterFileUploadData.map((posterFile) => posterFile.path)[0];
    }

    const notificationContentsData = translations.map((tr) => {
      let title = '';
      const words = tr.short_description.trim().split(/\s+/);
      const movieTranslations = season.movie?.translations.find(
        (mtr) => mtr.language === tr.language,
      );
      const description =
        words.length > 10
          ? `${words.slice(0, 10).join(' ')}...`
          : words.join(' ');

      if (tr.language === AppLanguage.FA) {
        title = `🎬 ${movieTranslations?.title} - فصل ${season.order}، قسمت ${body.order} منتشر شد!`;
      } else if (tr.language === AppLanguage.EN) {
        title = `🎬 ${movieTranslations?.title} - Season ${season.order}, Episode ${body.order} is released!`;
      } else if (tr.language === AppLanguage.AR) {
        title = `🎬 ${movieTranslations?.title} - تم إطلاق الموسم ${season.order}، الحلقة ${body.order}!`;
      }

      return {
        title,
        description,
        lang: tr.language,
        image: imagePath,
      };
    });

    return await this.notificationService.sendNotification(
      usersId,
      notificationContentsData,
    );
  }

  async createEpisode(body: CreateEpisodeDto) {
    const result = await prisma.$transaction(async (tx) => {
      const season = await this.episodeRepository.findSeasonWithMovie(
        body.season_id,
        tx,
      );
      if (!season) {
        throw new BadRequestException('season was not found');
      }
      if (season.movie.type !== MovieType.SERIES) {
        throw new BadRequestException('Movie type must be SERIES');
      }

      const { translations, files, ...otherBodyData } = body;

      const episodeFilms = files.filter(
        (file) => file.type === EpisodeFileType.FILM,
      );
      if (!episodeFilms.length || episodeFilms.length > 1) {
        throw new BadRequestException('Episode must take one Film');
      }

      if (
        typeof episodeFilms[0].intro_start_time !== 'number' ||
        typeof episodeFilms[0].intro_duration !== 'number' ||
        typeof episodeFilms[0].outro_duration !== 'number'
      ) {
        throw new BadRequestException(
          'Intro or outro information is not valid',
        );
      }

      const episodePosters = files.filter(
        (file) => file.type === EpisodeFileType.POSTER,
      );
      if (!episodePosters.length || episodePosters.length > 1) {
        throw new BadRequestException('Episode must take one Poster');
      }

      const createdEpisode = await this.episodeRepository.createEpisode(
        { ...otherBodyData, movie_id: season.movie_id },
        tx,
      );
      const episodeTranslationsData = translations.map((episodeTranslation) => {
        return {
          ...episodeTranslation,
          episode_id: createdEpisode.id,
        };
      });
      const episodeFilesData = files.map((episodeFile) => {
        return {
          ...episodeFile,
          episode_id: createdEpisode.id,
        };
      });
      await this.episodeTranslationService.createEpisodeTranslations(
        episodeTranslationsData,
        tx,
      );
      await this.episodeFileService.createEpisodeFiles(episodeFilesData, tx);

      return createdEpisode;
    });

    await this.handleSendNotification(body);

    return result;
  }

  async updateEpisode(episode_id: number, body: CreateEpisodeDto) {
    const result = await prisma.$transaction(async (tx) => {
      const season = await this.episodeRepository.findSeasonWithMovie(
        body.season_id,
        tx,
      );
      if (!season) {
        throw new BadRequestException('season was not found');
      }

      const { translations, files, ...otherBodyData } = body;

      const episodeFilms = files.filter(
        (file) => file.type === EpisodeFileType.FILM,
      );
      if (!episodeFilms.length || episodeFilms.length > 1) {
        throw new BadRequestException('Episode must take one Film');
      }

      const updatedEpisode = await this.episodeRepository.updateEpisode(
        { ...otherBodyData, movie_id: season.movie_id },
        episode_id,
        tx,
      );
      const episodeTranslationsData = translations.map((episodeTranslation) => {
        return {
          ...episodeTranslation,
          episode_id: updatedEpisode.id,
        };
      });
      const episodeFilesData = files.map((episodeFile) => {
        return {
          ...episodeFile,
          episode_id: updatedEpisode.id,
        };
      });
      await this.episodeTranslationService.updateEpisodeTranslations(
        episodeTranslationsData,
        episode_id,
        tx,
      );
      await this.episodeFileService.updateEpisodeFiles(
        episodeFilesData,
        episode_id,
        tx,
      );

      return updatedEpisode;
    });
    return result;
  }

  async deleteEpisodes(episodeIds: number[]) {
    const result = await prisma.$transaction(async (tx) => {
      return await this.episodeRepository.deleteEpisodes(episodeIds, tx);
    });
    return result;
  }

  async getEpisodeDetailAdmin(episodeId: number, tx?: TransactionType) {
    const episode = await this.episodeRepository.getEpisodeDetailAdmin(
      episodeId,
      tx,
    );

    if (episode) {
      const { files, ...otherEpisodeData } = episode;
      const episodeFiles = files.map((file) => {
        return { ...file.upload, type: file.type };
      });
      return { ...otherEpisodeData, files: episodeFiles };
    } else {
      throw new NotFoundException('episode was not found');
    }
  }

  async getEpisodeDetailPublic(
    episodeSlug: string,
    query: GetEpisodeDetailPublicDto,
  ) {
    const result = await prisma.$transaction(async (tx) => {
      const episode = await this.episodeRepository.getEpisodeDetailPublic(
        episodeSlug,
        query.lang,
        tx,
      );

      if (episode) {
        const { files, translations, movie, season, ...otherEpisodeData } =
          episode;
        const episodeFiles = files.map((file) => {
          return {
            ...file.upload,
            type: file.type,
            intro_start_time: file.intro_start_time,
            intro_duration: file.intro_duration,
            outro_duration: file.outro_duration,
          };
        });
        const episodeTranslation = translations[0];
        const normalizedMovie = normalizeMovieDetail(movie);
        const {
          translations: episodeSeasonTranslations,
          ...otherEpisodeSeasonData
        } = season;

        const nextEpisode = await this.getNextEpisode(
          episode.order,
          episode.season.order,
          query.lang,
          tx,
        );
        return {
          ...otherEpisodeData,
          title: episodeTranslation.title,
          short_description: episodeTranslation.short_description,
          files: episodeFiles,
          movie: normalizedMovie,
          season: {
            title: episodeSeasonTranslations[0].title,
            ...otherEpisodeSeasonData,
          },
          next_episode: nextEpisode,
        };
      } else {
        throw new NotFoundException('episode was not found');
      }
    });

    return result;
  }

  async getNextEpisode(
    currentEpisodeOrder: number,
    currentEpisodeSeasonOrder: number,
    lang: AppLanguage = defaultLang,
    tx: TransactionType,
  ) {
    const nextEpisode = await this.episodeRepository.getNextEpisode(
      currentEpisodeOrder,
      currentEpisodeSeasonOrder,
      lang,
      tx,
    );
    if (nextEpisode) {
      const {
        translations: nextEpisodeTranslations,
        season: nextEpisodeSeason,
        ...otherNextEpisodeData
      } = nextEpisode ?? {};

      return {
        ...otherNextEpisodeData,
        title: nextEpisodeTranslations?.[0]?.title,
        season_title: nextEpisodeSeason?.translations[0].title,
      };
    }

    return null;
  }

  async getAllEpisodes(query: GetAllEpisodesDto) {
    const { page, page_size } = paginationCalculator(
      query.page || 1,
      query.page_size || 10,
    );
    const episodes = await this.episodeRepository.getAllEpisodes({
      page,
      page_size,
      search: query.search?.trim() || '',
      lang: query.lang || defaultLang,
      sort_type: query.sort === SortType.ASC ? 'asc' : 'desc',
    });

    const normalizedEpisodes = episodes.map((episode) => {
      const { translations, files, season, movie, ...otherEpisodeData } =
        episode;

      const episodeFiles = files.map((file) => {
        return {
          ...file.upload,
          type: file.type,
          intro_start_time: file.intro_start_time,
          intro_duration: file.intro_duration,
          outro_duration: file.outro_duration,
        };
      });

      const episodesTranslation = translations[0];
      return {
        ...otherEpisodeData,
        title: episodesTranslation.title,
        movie_title: movie.translations[0].title,
        season_title: season.translations[0].title,
        movie_season_count: movie._count.seasons,
        files: episodeFiles,
      };
    });
    const episodesCount = await this.episodeRepository.getEpisodesCount(
      query.search?.trim(),
    );
    return {
      page: page + 1,
      page_size,
      count: episodesCount,
      data: normalizedEpisodes,
    };
  }
}
