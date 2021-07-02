import { Request } from "express"

import { IUsersRepository } from "@v1/repositories"
import { SqliteUsersRepository } from "@v1/repositories/implementations"

import { User } from "@v1/entities"

class UpdateUserService {
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
export default async (request: Request) => {
  try {
    const UsersRepository = new SqliteUsersRepository()
    const UpdateUser = new UpdateUserService(UsersRepository)

    const { 
      usernameAlreadyExists,
      available_usernames, 
      user
    } = await UpdateUser.update(request.params.id, request.body)
    
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