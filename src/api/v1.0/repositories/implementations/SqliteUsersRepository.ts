import { IUsersRepository } from "../IUsersRepository"
import { User } from "@api/v1.0/entities/User"

import { User as UserType } from "@prisma/client"
import { prisma } from "@src/prisma"

import validator from "validator"

export class SqliteUsersRepository implements IUsersRepository {
  async findByEmail(email: string): Promise<UserType[]> {
    const isEmail = validator.isEmail(email)

    if(!isEmail) {
      throw new Error("Invalid email.")
    }

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