import { User } from "../../generated/prisma";

export type UserType = Omit<User, 'password'>;
