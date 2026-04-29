import { EpisodeFileType } from '@prisma/client';

export type CreateEpisodeFilePropsType = {
  episode_id: number;
  type: EpisodeFileType;
  upload_id: number;
};
