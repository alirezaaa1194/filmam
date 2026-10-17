import { EpisodeFileType } from '../../generated/prisma';

export type CreateEpisodeFilePropsType = {
  episode_id: number;
  type: EpisodeFileType;
  upload_id: number;
  intro_start_time?: number;
  intro_duration?: number;
  outro_duration?: number;
  duration?: string;
};
