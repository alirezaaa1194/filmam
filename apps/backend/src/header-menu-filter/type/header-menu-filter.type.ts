import { SectionFilterKey } from '../../generated/prisma';

export type CreateHeaderMenuFilterServiceType = {
  filter_key: SectionFilterKey;
  filter_value: string;
};

export type CreateHeaderMenuFilterRepositoryType =
  CreateHeaderMenuFilterServiceType & {
    menu_id: number;
  };
