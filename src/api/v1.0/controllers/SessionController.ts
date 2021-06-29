import { Request, Response } from "express"

import { CreateSession } from "@v1/services/session"

export const SessionController = {
  async create(request: Request, response: Response) {
    const { 
      error,
      status,
      refresh_token,
      jwt_login,
      social_login,
      message
    } = await CreateSession(request)

    if(error) return response.status(status).json(message)

    response.header("authorization", refresh_token)

    return response.status(status).json({
      jwt_login,
      social_login,
      refresh_token
    })
  }
}