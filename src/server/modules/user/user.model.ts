import { User as UserPrisma } from "@/generated/prisma/client";
export type User = UserPrisma;
export enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
}
export type UserWithRelations = UserPrisma & {
  // Add related entities here if needed
};
