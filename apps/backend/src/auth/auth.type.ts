import { User } from 'src/generated/prisma/client';

export type UserType = Omit<User, 'password'>;
