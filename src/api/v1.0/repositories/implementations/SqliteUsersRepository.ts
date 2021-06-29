import { IUsersRepository } from "../IUsersRepository"
import { User } from "@v1/entities/User"

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
  
  async findById(id: string, select?: "userhash"): Promise<UserType | { userhash: string | undefined } | null> {
    const user = await prisma.user.findUnique({
      where: {
        id
      }
    })

    if(select != undefined) {
      const user = await prisma.user.findUnique({
        where: {
          id
        },

        select: {
          [select]: true
        }
      })

      return ({
        userhash: user?.userhash
      })
    }

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

  async findUsername(username: string, userhash: string | undefined): Promise<{ id: string, username: string, userhash: string }[]> {
    const user = await prisma.user.findMany({
      where: {
        username,
        userhash
      },

      select: {
        id: true,
        username: true,
        userhash: true
      }
    })

    return user
  }

  async findAllPagination(page: number, quantity: number, property?: string, sort?: string): Promise<UserType[] | {}> {
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

  async update({ id, created_at, ...props }: User): Promise<void> {
    await prisma.user.update({
      where: {
        id
      },

      data: {
        ...props
      }
    })
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

  async delete(id: string): Promise<void> {
    await prisma.address.deleteMany({
      where: {
        userId: id
      }
    })

    await prisma.user.delete({
      where: {
        id
      }
    })
  }
}