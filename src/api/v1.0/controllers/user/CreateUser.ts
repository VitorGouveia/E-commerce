import { Request, Response} from "express"

import { IUsersRepository } from "../../repositories/IUsersRepository"
import { SqliteUsersRepository } from "../../repositories/implementations/SqliteUsersRepository"

import { User, randomNumber } from "../../entities/User"

import auth from "@auth"

type createUserResponse = {
  userHashAlreadyExists: string
  userAlreadyExists: User
  access_token: string
  user: User
}

// create user service is responsible for authentication and some rules
export class CreateUserService {
  constructor(
    private usersRepository: IUsersRepository
  ) {}

  async create(userRequest: User) {
    try {
      // searches users with that e-mail
      const userAlreadyExists = await this.usersRepository.findByEmail(userRequest.email)

      // if user with same email exists
      if(userAlreadyExists.length) throw new Error("User already exists.")

      // creates user
      const user = new User(userRequest)

      // searches for duplicate user hash
      const userHashAlreadyExists = await this.usersRepository.findUserhash(user.name, user.userhash)

      // stores user in the database
      await this.usersRepository.save(user)

      // creates JWT access token
      const access_token = auth.create(user, "24h")
      
      return {
        userHashAlreadyExists,
        access_token,
        user
      }
    } catch (error) {
      throw new Error(error.message)
      return error
    }
  }
}

// just return everything from create user service
export default async (request: Request, response: Response) => {
  try {
    // create sqlite repository
    const sqliteUsersRepository = new SqliteUsersRepository()

    // create user service
    const createUser = new CreateUserService(sqliteUsersRepository)

    // execute user service
    const {
      userHashAlreadyExists,
      userAlreadyExists,
      access_token,
      user 
    }: createUserResponse = await createUser.create(request.body)

    // if user with name and hash already exist generate another hash
    userHashAlreadyExists && (
      user.userhash = randomNumber(4)
    )

    // respond with user information
    return ({
      status: 201,
      access_token,
      user,
      message: "User created with success!"
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