import { EpisodeFileType } from '../../generated/prisma';

export type CreateEpisodeFilePropsType = {
  episode_id: number;
  type: EpisodeFileType;
  upload_id: number;
};
