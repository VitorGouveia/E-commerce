import { Request, Response } from "express"

import jwt from "jsonwebtoken"
import { compare } from "bcrypt"

import { prisma } from "@src/prisma"

const SessionController = {
  async create(request: Request, response: Response) {
    const { email, password } = request.body

    const authorizationHeader = request.headers.authorization

    try {
      const JWTHeader = jwt.verify(String(authorizationHeader), String(process.env.JWT_ACCESS_TOKEN))
      const refresh_token = jwt.sign({
        uuid: JWTHeader["id"],
        name: JWTHeader["name"],
        email: JWTHeader["email"],
        password: JWTHeader["password"]
      }, String(process.env.JWT_REFRESH_TOKEN), { expiresIn: "168h" })

      response.header("authorization", refresh_token)

      return response.status(302).json({
        auth: true,
        jwt: true,
        user: {
          uuid: JWTHeader["id"],
          name: JWTHeader["name"],
          email: JWTHeader["email"],
          password: JWTHeader["password"],
        },
        refresh_token
      })
    } catch (error) {
      const user = await prisma.user.findMany({
        where: {
          email
        }
      })

      if (user.length == 0) {
        return response.status(404).json({ auth: false, message: "Wrong e-mail!" })
      }

      if (await compare(password, user[0].password) != true) {
        return response.status(404).json({ auth: false, message: "Wrong password!" })
      }

      const refresh_token = jwt.sign({
        id: user[0].id,
        name: user[0].name,
        email: user[0].email,
        password: user[0].password
      }, String(process.env.JWT_REFRESH_TOKEN), { expiresIn: "168h" })

      response.header("authorization", refresh_token)

      return response.status(302).json({
        auth: true,
        jwt: false,
        user,
        refresh_token
      })
    }
  }
}

export { SessionController }