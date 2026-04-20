import { SectionMovieViewMode } from '@prisma/client';

export type CreateSectionMovieBodyType = {
  movie_id: number;
  section_id: number;
  order: number;
  view_mode?: SectionMovieViewMode;
};
