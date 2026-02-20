// common/decorators/public.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const Is_Admin_Key = 'IsAdmin';

export const Admin = () => SetMetadata(Is_Admin_Key, true);
