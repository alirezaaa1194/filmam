import { User } from '../../generated/prisma/client';

export type UserType = Omit<User, 'password'>;
