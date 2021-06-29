import { Request, Response } from "express"
import { ParsedQs } from "qs"

import { IUsersRepository } from "@v1/repositories"
import { SqliteUsersRepository } from "@v1/repositories/implementations"

import { User } from "@v1/entities"

type readUserResponse = {
  users: User[]
}

export class ReadUserService {
  constructor(
    private usersRepository: IUsersRepository
  ) {}

  async read(id: string, { query }: Request<ParsedQs>) {
    try {
      // listing options
      let page: number = Number(query.page)
      let quantity: number = Number(query.quantity)
  
      let sort: any = String(query.sort)
      let property: any = String(query.property)
      
      // if id is supplied search user with that id
      if(id != undefined) {
        const users = await this.usersRepository.findById(id)
  
        return {
          users
        }
      }
  
      // if no page and no quantity are supplied, list all users
      if(!page && !quantity) {
        const users = await this.usersRepository.findAll(property, sort)
  
        return {
          users
        }
      }
  
      // if only page and quantity are supplied, sort users with pagination
      if(page != undefined && sort != undefined) {
        const users = await this.usersRepository.findAllPagination(page, quantity, property, sort)

        return {
          users
        }
      }
    } catch (error) {
      return error
    }
  }
}

export default async (request: Request) => {
  try {
    // create sqlite repository
    const sqliteUsersRepository = new SqliteUsersRepository()

    // create read user service
    const readUser = new ReadUserService(sqliteUsersRepository)

    // execute user service
    const { users }: readUserResponse = await readUser.read(request.params.id, request)

    // respond with user information
    return ({
      status: 202,
      users,
      message: "Listed users with success!"
    })

  } catch (error) {
    // in case of error
    return ({
      error: true,
      status: 400,
      message: "Failed to read user."
    })
  }
}