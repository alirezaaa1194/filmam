import { CommentEntityType, SectionMovieViewMode } from '../../generated/prisma';

export type CreateSectionMovieBodyType = {
  movie_id: number;
  section_id: number;
  order: number;
  view_mode?: SectionMovieViewMode;
  entity_type: CommentEntityType;
};
