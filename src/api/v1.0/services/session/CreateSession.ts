import { Request } from "express"

import { SqliteUsersRepository } from "@v1/repositories/implementations"
import { IUsersRepository } from "@v1/repositories"

import { verify, sign } from "jsonwebtoken"
import { compare } from "bcrypt"

type loginRequestType = {
  name: string
  email: string
  password: string
}

export class CreateSessionService {
  constructor(
    private usersRepository: IUsersRepository
  ) {}

  async create(loginRequest: loginRequestType, authHeader: string | undefined) {
    try {
      // jwt refresh token secret
      const jwt_access_token = String(process.env.JWT_ACCESS_TOKEN)
      const jwt_refresh_token = String(process.env.JWT_REFRESH_TOKEN)

      // jwt access token from headers
      const token = authHeader?.split(" ")[1]

      if(token == undefined) throw new Error("No token was found!")

      // get information from authorization header
      const access_token = verify(token, jwt_access_token)
      const jwt_user = {
        id: access_token["id"],
        name: access_token["name"],
        email: access_token["email"]
      }

      // giving the user a refresh token
      const refresh_token = sign(
        jwt_user,             // embbeding user info in jwt
        jwt_refresh_token,    // refresh token secret
        { expiresIn: "168h" } // 7 days
      )

      return ({
        jwt_login: true,
        refresh_token
      })
    } catch (error) {
      const { email, password } = loginRequest
      
      // searches user with input email
      const user = await this.usersRepository.findByEmail(email)
      
      // if there isn't a user with input email
      if(user.length == 0) throw new Error("Wrong e-mail!")

      // compare from input password and database password
      const comparePassword = await compare(password, user[0].password)

      // if passwords do not match up
      if(comparePassword != true) throw new Error("Wrong password!")

      // if everything goes as normal
      // jwt refresh token secret
      const jwt_refresh_token = String(process.env.JWT_REFRESH_TOKEN)

      const [{ id, name }] = user
      const jwt_user = {
        id,
        name,
        email: user[0].email
      }

      // giving the user a refresh token
      const refresh_token = sign(
        jwt_user,             // embbeding user info in jwt
        jwt_refresh_token,    // refresh token secret
        { expiresIn: "168h" } // 7 days
      )

      return ({
        social_login: true,
        refresh_token
      })
    }
  }
}

export default async (request: Request) => {
  try {
    const UsersRepository = new SqliteUsersRepository()
    const CreateSession = new CreateSessionService(UsersRepository)

    const {
      refresh_token,
      jwt_login,
      social_login
    } = await CreateSession.create(request.body, request.headers["authorization"])

    return ({
      jwt_login,
      social_login,
      status: 200,
      refresh_token
    })
  } catch (error) {
    return ({
      error: true,
      status: 400,
      message: error.message
    })
  }
}