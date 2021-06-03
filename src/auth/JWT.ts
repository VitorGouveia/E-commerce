import { sign, verify } from "jsonwebtoken"
import { User } from "@prisma/client"

export const auth = {
  create({ id, name, email, password }: User, expiresIn: string) {
    const user = {
      id,
      name,
      email,
      password
    }

    const JWT_ACCESS_TOKEN = String(process.env.JWT_ACCESS_TOKEN)

    const access_token = sign(user, JWT_ACCESS_TOKEN, {
      expiresIn
    })

    return access_token
  },

  verify(JWT: string) {
    const JWT_REFRESH_TOKEN = String(process.env.JWT_REFRESH_TOKEN)

    try {
      return verify(JWT, JWT_REFRESH_TOKEN)
    } catch (err) {
      return err
    }
  }
}