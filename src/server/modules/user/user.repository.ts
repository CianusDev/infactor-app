import { User } from "@/generated/prisma/client";
import { UserUpdateInput } from "@/generated/prisma/models";
import { prisma } from "@/server/config/database";
import { GetAllDataResponse, QueryDataParams } from "@/types/data";
import { CreateUserInput } from "./user.schema";

export class UserRepository {
  async findUserById(userId: string): Promise<User | null> {
    const user = prisma.user.findUnique({
      where: { id: userId },
    });
    return user;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const user = prisma.user.findUnique({
      where: { email },
    });
    return user;
  }

  async createUser({
    firstName,
    lastName,
    email,
    password,
    role,
  }: CreateUserInput): Promise<User | null> {
    const user = prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password,
        role,
      },
    });
    return user;
  }

  async updateUserPassword(
    userId: string,
    newHashedPassword: string,
  ): Promise<User | null> {
    const user = prisma.user.update({
      where: { id: userId },
      data: { password: newHashedPassword },
    });
    return user;
  }

  async updateUserInfo(
    userId: string,
    { firstName, lastName }: UserUpdateInput,
  ): Promise<User | null> {
    const user = prisma.user.update({
      where: { id: userId },
      data: {
        firstName,
        lastName,
      },
    });
    return user;
  }

  async deleteUserById(userId: string) {
    await prisma.user.delete({
      where: { id: userId },
    });
    return;
  }

  async deleteUserByEmail(email: string) {
    await prisma.user.delete({
      where: { email },
    });
    return;
  }
  async getAllUsers({
    limit,
    offset,
    role,
    search,
  }: QueryDataParams): Promise<GetAllDataResponse<Omit<User, "password">[]>> {
    const users = await prisma.user.findMany({
      skip: offset ?? 0,
      take: limit ?? undefined,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
      where: {
        ...(role ? { role } : {}),
        ...(search
          ? {
              OR: [
                { firstName: { contains: search, mode: "insensitive" } },
                { lastName: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      orderBy: { createdAt: "desc" },
    });

    const total = await prisma.user.count({
      where: {
        ...(role ? { role } : {}),
        ...(search
          ? {
              OR: [
                { firstName: { contains: search, mode: "insensitive" } },
                { lastName: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
              ],
            }
          : {}),
      },
    });

    return {
      data: users,
      total,
      limit: limit ?? total,
      offset: offset ?? 0,
    };
  }
}
