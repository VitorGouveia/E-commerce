import { verify } from "jsonwebtoken"

import { Request, Response, NextFunction } from "express"

export default function (request: Request, response: Response, next: NextFunction) {
  try {
    const JWT_REFRESH_TOKEN = String(process.env.JWT_REFRESH_TOKEN)
    const authHeader = request.headers["authorization"]
    const token = String(authHeader && authHeader.split(" ")[1])

    verify(token, JWT_REFRESH_TOKEN)

    next()
  } catch (error) {
    console.log(error)
  }
}