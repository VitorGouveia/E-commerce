import { verify } from "jsonwebtoken"

import { Request, Response, NextFunction } from "express"

export default (request: Request, response: Response, next: NextFunction) => {
  try {
    // get JWT refresh token secret
    const JWT_REFRESH_TOKEN = String(process.env.JWT_REFRESH_TOKEN)

    // get JWT refresh token from headers
    const authHeader = request.headers.authorization
    // remove Bearer prefix from token
    const token = String(authHeader && authHeader.split(" ")[1])

    verify(token, JWT_REFRESH_TOKEN)

    !authHeader && (
      response.status(400).json({
        message: "No JWT refresh token was found! Redirect to login."
      })
    )

    next()
  } catch (error) {
    return response.status(401).json("Failed to verify Admin user JWT token.")
  }
}