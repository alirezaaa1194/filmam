import { SeasonFileType } from '../../generated/prisma';

export type CreateSeasonFilePropsType = {
  season_id: number;
  type: SeasonFileType;
  upload_id: number;
};
