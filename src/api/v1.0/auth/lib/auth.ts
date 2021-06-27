import { User } from "@prisma/client"

import { createToken } from "./token"

export const auth = {
  create({ id, name, email }: User, expiresIn: string) {
    const user = { id, name, email }

    const access_token = createToken(user, expiresIn)

    return access_token
  }
}