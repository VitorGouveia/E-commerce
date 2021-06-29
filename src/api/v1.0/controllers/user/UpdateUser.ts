import { Request, Response} from "express"

import { User } from "@v1/entities/User"

import { IUsersRepository } from "@v1/repositories/IUsersRepository"
import { SqliteUsersRepository } from "@v1/repositories/implementations/SqliteUsersRepository"

// create user service is responsible for authentication and some rules
export class UpdateUserService {
  constructor(
    private usersRepository: IUsersRepository
  ) {}

  async update(id: string, { name, lastname, username, cpf, email, password }: User) {
    try {
      // middleware already checks for JWT
      const userInfo = await this.usersRepository.findById(id, "userhash")
      const userhash = userInfo?.userhash
      // searches user with the same username and userhash
      const usernameAlreadyExists = await this.usersRepository.findUsername(username, userhash)
      if(usernameAlreadyExists.length) return { usernameAlreadyExists }
      
      // if there is a user with the same username and userhash respond with other available usernames
      const available_usernames = [
        { username: `${username}${lastname}` },
        { username: `${name}${lastname}` }
      ]
      
      // create user
      const user = new User({ name, lastname, username, userhash, cpf, email, password }, id)

      // updates user
      await this.usersRepository.update(user)
      
      return ({
        available_usernames,
        user
      })
    } catch (error) {
      throw new Error(error.message)
    }
  }
}

// just return everything from create user service
export default async (request: Request, response: Response) => {
  try {
    const sqliteUsersRepository = new SqliteUsersRepository()
    const updateUser = new UpdateUserService(sqliteUsersRepository)

    const { 
      usernameAlreadyExists,
      available_usernames, 
      user
    } = await updateUser.update(request.params.id, request.body)
    
    if(usernameAlreadyExists?.length) {
      return ({
        error: true,
        status: 400,
        message: "Username already taken.",
        available_usernames
      })
    }

    // respond with user information
    return ({
      status: 200,
      user,
      message: "User updated with success!"
    })
    
  } catch (error) {
    // in case of error, send error details
    return ({
      error: true,
      status: 400,
      message: error.message
    })
  }
}