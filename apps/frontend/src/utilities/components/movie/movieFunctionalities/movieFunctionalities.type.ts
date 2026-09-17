import { MovieDetailPublicType, MovieListItemType } from "../../../../types";

export type MovieFunctionalitiesProps = {
  movie: MovieDetailPublicType | MovieListItemType;
  save?: boolean;
  notification?: boolean;
  like?: boolean;
  dislike?: boolean;
  play?: MoviePlayFunctionality | false;
  trailer?: boolean;
  share?: boolean;
  download?: boolean;
};

export type MoviePlayFunctionality = {
  title: string;
};
