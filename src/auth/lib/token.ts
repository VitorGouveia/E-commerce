import { sign, verify } from "jsonwebtoken"
import { Request } from "express"

let request: Request

type userType = {
  id: string
  name: string
  email: string
}

export function createToken(user: userType, expiresIn: string) {
  const JWT_ACCESS_TOKEN: string = String(process.env.JWT_ACCESS_TOKEN)
  
  const access_token = sign(user, JWT_ACCESS_TOKEN, {
    expiresIn
  })
  
  return access_token
}

export function verifyToken(authHeader: string) {
  const JWT_REFRESH_TOKEN: string = String(process.env.JWT_REFRESH_TOKEN)

  return verify(authHeader, JWT_REFRESH_TOKEN)
}

export function checkAuthHeader() {
  const authHeader = request.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  if(token == null) {
    throw new Error("no token was provided")
  }

  return String(token)
}