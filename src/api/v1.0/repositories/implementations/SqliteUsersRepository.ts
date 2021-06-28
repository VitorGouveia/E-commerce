import { IUsersRepository } from "../IUsersRepository"
import { User } from "../../entities/User"

import { User as UserType } from "@prisma/client"
import { prisma } from "@src/prisma"

export class SqliteUsersRepository implements IUsersRepository {
  async findByEmail(email: string): Promise<UserType[]> {
    const user = await prisma.user.findMany({
      where: {
        email
      }
    })

    return user
  }

  async findUserhash(name: string, userhash: string): Promise<UserType[]> {
    const user = await prisma.user.findMany({
      where: {
        name,
        userhash
      }
    })

    return user
  }

  async save(user: User): Promise<void> {
    const {
      id,
      created_at,
      name,
      email,
      password,
      userhash,
      username
    } = user

    await prisma.user.create({
      data: {
        id,
        created_at,
        name,
        email,
        password,
        userhash,
        username
      }
    })
  }
}