import { registerEnumType } from '@nestjs/graphql';

export enum MovieType {
  SERIES = 'SERIES',
  CINEMATIC = 'CINEMATIC',
}

registerEnumType(MovieType, {
  name: 'MovieType',
});

export enum AppLanguage {
  FA = 'FA',
  EN = 'EN',
  AR = 'AR',
}

registerEnumType(AppLanguage, {
  name: 'AppLanguage',
});

export enum SortType {
  ASC = 'ASC',
  DESC = 'DESC',
}

registerEnumType(SortType, {
  name: 'SortType',
});

export enum SortByType {
  CREATED_AT = 'CREATED_AT',
  LIKES = 'LIKES',
  WATCHES = 'WATCHES',
}

registerEnumType(SortByType, {
  name: 'SortByType',
});

export enum MovieFileType {
  POSTER = 'POSTER',
  BANNER = 'BANNER',
  THUMBNAIL = 'THUMBNAIL',
  TRAILER = 'TRAILER',
  FILM = 'FILM',
}

registerEnumType(MovieFileType, {
  name: 'MovieFileType',
});

export enum RoleType {
  CREATOR = 'CREATOR',
  ACTOR = 'ACTOR',
}

registerEnumType(RoleType, {
  name: 'RoleType',
});
