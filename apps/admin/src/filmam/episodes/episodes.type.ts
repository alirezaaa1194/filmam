import { z } from 'zod'
import type {
  AppLanguagesEnum,
  EpisodeDetailAdminType,
  EpisodeListItemType,
  UploadType,
} from '../../types'

export type Episode = EpisodeListItemType
export type EpisodeDetailType = EpisodeDetailAdminType

export type EpisodesApiResponseType = {
  page: number
  page_size: number
  count: number
  data: Episode[]
}

export const episodeUploadTypes = [
  'POSTER',
  'COVER',
  'TRAILER',
  'FILM',
] as const
export type EpisodeUploadTypeValue = (typeof episodeUploadTypes)[number]

export type CreateEpisodePayloadType = {
  slug: string
  order: number
  season_id: number
  translations: {
    title: string
    short_description: string
    language: AppLanguagesEnum
  }[]
  files: {
    upload_id: number
    type: EpisodeUploadTypeValue
    intro_start_time?: number
    intro_duration?: number
    outro_duration?: number
  }[]
}

export const deleteEpisodesSchema = z.object({
  episode_ids: z.array(z.number()),
})
export type DeleteEpisodesPayloadType = z.infer<typeof deleteEpisodesSchema>

export type EpisodeFilesState = {
  poster: UploadType[]
  cover: UploadType[]
  trailer: UploadType[]
  film: UploadType[]
  introStartTime: string
  introDuration: string
  outroDuration: string
}

export const emptyEpisodeFilesState: EpisodeFilesState = {
  poster: [],
  cover: [],
  trailer: [],
  film: [],
  introStartTime: '',
  introDuration: '',
  outroDuration: '',
}
