import { SeasonFileType } from "@prisma/client";

export type CreateSeasonFilePropsType = {
  season_id: number;
  type: SeasonFileType;
  upload_id: number;
};
