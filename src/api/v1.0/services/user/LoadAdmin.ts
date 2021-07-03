import { Request } from "express"

import { IUsersRepository } from "@v1/repositories"
import { SqliteUsersRepository } from "@v1/repositories/implementations"

import { User } from "@v1/entities"

class LoadAdminService {
  constructor(
    private usersRepository: IUsersRepository
  ) {}

  async load(users: User[] | User) {
    try {
      if(Array.isArray(users)) {
        users.forEach(async (user: User) => {
          const newUser = new User(user, {
            admin: {
              username: user.username,
              userhash: user.userhash
            }
          })
  
          await this.usersRepository.save(newUser)
        })

        return
      }

      const newUser = new User(users, {
        admin: {
          username: users.username,
          userhash: users.userhash
        }
      })

      await this.usersRepository.save(newUser)
    } catch (error) {
      throw new Error(error.message)
    }
  }
}

export default async (request: Request) => {
  try {
    const usersRepository = new SqliteUsersRepository()
    const LoadAdmin = new LoadAdminService(usersRepository)

    await LoadAdmin.load(request.body)

    return ({
      status: 200,
      message: "Loaded admin users from file."
    })
  } catch (error) {
    return ({
      error: true,
      status: 400,
      message: "Failed to load admin users."
    })
  }
}