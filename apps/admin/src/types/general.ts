//      ----------------------- types -----------------------
export type __PaginationType<T> = {
  page: number
  page_size: number
  count: number
  data: T
}

export type __JWTTokenType = {
  accessToken: string
  accessTokenExpiresIn: number
  refreshToken: string
  refreshTokenExpiresIn: number
}

export type __MessageType = {
  message: string
}

//      ----------------------- enums -----------------------

export enum __AppLanguagesEnum {
  FA = 'FA',
  EN = 'EN',
  AR = 'AR',
}
