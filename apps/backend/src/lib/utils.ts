import { AppLanguage } from '../generated/prisma';

export const defaultLang = AppLanguage.FA;

export const paginationCalculator = (page: number, page_size: number) => {
  return {
    page: (Number(page) - 1) * Number(page_size),
    page_size: Number(page_size),
  };
};

export const normalizeMovieDetail = (movie) => {
  const { files, translations, seasons, _count, ...otherMovieData } = movie;
  const movieFactors = otherMovieData.factors?.map((movieFactor) => {
    const { translations, movie_factors, ...otherMovieFactorData } =
      movieFactor.factor;
    const movieFactorTranslation = translations?.[0];
    const { first_name, last_name } = movieFactorTranslation;

    const mainMovieFactor = movie_factors?.find(
      (movieFactorData) => movieFactorData.role_id === movieFactor.role.id,
    );
    const mainMovieFactorTranslation = mainMovieFactor?.translations?.[0];

    const {
      translations: movieFactorRoleTranslation,
      ...otherMovieFactorRoleData
    } = movieFactor.role;
    const { name } = movieFactorRoleTranslation?.[0];
    return {
      ...otherMovieFactorData,
      order: movieFactor.order,
      first_name,
      last_name,
      role_name: mainMovieFactorTranslation?.role_name || null,
      role: { ...otherMovieFactorRoleData, name },
    };
  });
  const movieGenres = otherMovieData.genres?.map((movieGenre) => {
    const { genre } = movieGenre;
    const { translations, ...otherMovieGenreData } = genre;
    const movieGenreTranslation = translations?.[0];
    const { name } = movieGenreTranslation;
    return { ...otherMovieGenreData, name };
  });
  const movieCountries = otherMovieData.countries?.map((movieCountry) => {
    const { country } = movieCountry;
    const { translations, ...otherMovieCountryData } = country;
    const movieCountryTranslation = translations?.[0];
    const { label } = movieCountryTranslation;
    return { ...otherMovieCountryData, label };
  });
  const movieLanguages = otherMovieData.languages?.map((movieLanguage) => {
    const { language } = movieLanguage;
    const { translations, ...otherMovieLanguageData } = language;
    const movieLanguageTranslation = translations?.[0];
    const { label } = movieLanguageTranslation;
    return { ...otherMovieLanguageData, label };
  });
  const movieFiles = files?.map((movieFile) => {
    const { upload, type } = movieFile;
    return {
      ...upload,
      type,
      intro_start_time: movieFile.intro_start_time,
      intro_duration: movieFile.intro_duration,
      outro_duration: movieFile.outro_duration,
    };
  });
  const movieSeasons = seasons?.map((movieSeason) => {
    const { files, translations, ...otherSeasonData } = movieSeason;
    const movieFiles = files?.map((movieFile) => {
      const { upload, type } = movieFile;
      return { ...upload, type };
    });
    const { title } = translations?.[0];
    return { ...otherSeasonData, title, files: movieFiles };
  });
  const { title, short_description, description } = translations?.[0];
  return {
    ...otherMovieData,
    seasons_count: _count?.seasons,
    episodes_count: _count?.episodes,
    title,
    short_description,
    description,
    factors: movieFactors,
    genres: movieGenres,
    countries: movieCountries,
    languages: movieLanguages,
    seasons: movieSeasons,
    files: movieFiles,
  };
};

export const appLanguages = [
  {
    language: AppLanguage.FA,
  },
  {
    language: AppLanguage.EN,
  },
  {
    language: AppLanguage.AR,
  },
];
