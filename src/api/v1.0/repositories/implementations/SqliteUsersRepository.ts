import { IUsersRepository } from "../IUsersRepository"
import { User } from "@api/v1.0/entities/User"

import { User as UserType } from "@prisma/client"
import { prisma } from "@src/prisma"

import validator from "validator"

export class SqliteUsersRepository implements IUsersRepository {
  async findAll(property?: string, sort?: "asc" | "desc" | string): Promise<UserType[]> {
    const users = await prisma.user.findMany()

    if(property != undefined && sort != "undefined") {
      const users = await prisma.user.findMany({
        orderBy: [{
          [property]: sort
        }]
      })

      return users
    }

    return users
  }
  
  async findById(id: string): Promise<UserType | null> {
    const user = await prisma.user.findUnique({
      where: {
        id
      }
    })

    return user
  }

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

  async findAllPagination(page: number, quantity: number, property?: string, sort?: string): Promise<{}> {
    const users = await prisma.user.findMany({
      take: quantity,
      skip: quantity * page,
      select: {
        id: true,
        created_at: true,
        name: true,
        lastname: true,
        username: true,
        userhash: true,
        cpf: true,
        email: true
      }
    })

    if(property != undefined && sort != "undefined") {
      const users = await prisma.user.findMany({
        take: quantity,
        skip: quantity * page,
        orderBy: {
          [property]: sort
        }
      })

      return users
    }

    return users
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