import { AppLanguage, CommentEntityType } from '@prisma/client';

export const defaultLang = AppLanguage.FA;
export const accessTokenExpTime = '30d';

export const paginationCalculator = (page: number, page_size: number) => {
  return {
    page: (Number(page) - 1) * Number(page_size),
    page_size: Number(page_size),
  };
};

export const normalizeMovieDetail = (movie) => {
  const { files, translations, ...otherMovieData } = movie;
  const movieFactors = otherMovieData.factors?.map((movieFactor) => {
    const { translations, movie_factors, ...otherMovieFactorData } =
      movieFactor.factor;
    const movieFactorTranslation = translations[0];
    const { first_name, last_name } = movieFactorTranslation;

    const mainMovieFactor = movie_factors?.find(
      (movieFactorData) => movieFactorData.role_id === movieFactor.role.id,
    );
    const mainMovieFactorTranslation = mainMovieFactor?.translations?.[0];

    const {
      translations: movieFactorRoleTranslation,
      ...otherMovieFactorRoleData
    } = movieFactor.role;
    const { name } = movieFactorRoleTranslation[0];
    return {
      ...otherMovieFactorData,
      first_name,
      last_name,
      role_name: mainMovieFactorTranslation?.role_name || null,
      role: { ...otherMovieFactorRoleData, name },
    };
  });
  const movieGenres = otherMovieData.genres?.map((movieGenre) => {
    const { genre } = movieGenre;
    const { translations, ...otherMovieGenreData } = genre;
    const movieGenreTranslation = translations[0];
    const { name } = movieGenreTranslation;
    return { ...otherMovieGenreData, name };
  });
  const movieCountries = otherMovieData.countries?.map((movieCountry) => {
    const { country } = movieCountry;
    const { translations, ...otherMovieCountryData } = country;
    const movieCountryTranslation = translations[0];
    const { label } = movieCountryTranslation;
    return { ...otherMovieCountryData, label };
  });
  const movieLanguages = otherMovieData.languages?.map((movieLanguage) => {
    const { language } = movieLanguage;
    const { translations, ...otherMovieLanguageData } = language;
    const movieLanguageTranslation = translations[0];
    const { label } = movieLanguageTranslation;
    return { ...otherMovieLanguageData, label };
  });
  const movieFiles = files?.map((movieFile) => {
    const { upload, type } = movieFile;
    return { ...upload, type };
  });
  const { title, short_description, description } = translations[0];
  return {
    ...otherMovieData,
    title,
    short_description,
    description,
    factors: movieFactors,
    genres: movieGenres,
    countries: movieCountries,
    languages: movieLanguages,
    files: movieFiles,
  };
};

export const calculateMovieUserActivityCounts = (
  movieUserActivities: any[],
  entityId: number,
  entityType: CommentEntityType = CommentEntityType.MOVIE,
) => {
  if (entityType === CommentEntityType.MOVIE) {
    const userActivities = movieUserActivities;
    const likes =
      userActivities.find(
        (userActivity) =>
          userActivity.type === 'LIKE' && userActivity.movie_id === entityId,
      )?._count?._all || 0;
    const dislikes =
      userActivities.find(
        (userActivity) =>
          userActivity.type === 'DISLIKE' && userActivity.movie_id === entityId,
      )?._count?._all || 0;
    const watched =
      userActivities.find(
        (userActivity) =>
          userActivity.type === 'WATCHED' && userActivity.movie_id === entityId,
      )?._count?._all || 0;
    const watching =
      userActivities.find(
        (userActivity) =>
          userActivity.type === 'WATCHING' &&
          userActivity.movie_id === entityId,
      )?._count?._all || 0;

    const likesPercent = Math.round((likes / (likes + dislikes)) * 100);

    return {
      likes_counts: likes,
      likes_percent: isNaN(likesPercent) ? 0 : likesPercent,
      watches_counts: watching + watched,
    };
  } else {
    const userActivities = movieUserActivities;
    const likes =
      userActivities.find(
        (userActivity) =>
          userActivity.type === 'LIKE' && userActivity.episode_id === entityId,
      )?._count?._all || 0;
    const dislikes =
      userActivities.find(
        (userActivity) =>
          userActivity.type === 'DISLIKE' &&
          userActivity.episode_id === entityId,
      )?._count?._all || 0;
    const watched =
      userActivities.find(
        (userActivity) =>
          userActivity.type === 'WATCHED' &&
          userActivity.episode_id === entityId,
      )?._count?._all || 0;
    const watching =
      userActivities.find(
        (userActivity) =>
          userActivity.type === 'WATCHING' &&
          userActivity.episode_id === entityId,
      )?._count?._all || 0;

    const likesPercent = Math.round((likes / (likes + dislikes)) * 100);

    return {
      likes_counts: likes,
      likes_percent: isNaN(likesPercent) ? 0 : likesPercent,
      watches_counts: watching + watched,
    };
  }
};

export const appLanguages = [
  {
    language: AppLanguage.FA,
  },
  {
    language: AppLanguage.EN,
  },
  // {
  //   language: AppLanguage.AR,
  // },
];
