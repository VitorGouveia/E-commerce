import { Request, Response } from "express"

import { CreateUser, ReadUser, UpdateUser, DeleteUser, CreateAddress } from "./user"

export const UserController = {
  async create(request: Request, response: Response) {
    // executes create user service
    const { error, message, status, access_token, user } = await CreateUser(request)
    // in case of error
    if(error) return response.status(status).json(message)

    // sends JWT through headers
    response.header("authorization", access_token)

    // final response
    return response.status(status).json({
      message,
      user,
      access_token
    })
  },

  async read(request: Request, response: Response) {
    // executes read user service
    const { error, message, status, users } = await ReadUser(request)

    // in case of error
    if(error) return response.status(status).json(message)

    // final response
    return response.status(status).json({
      message,
      users
    })
  },
  
  async update(request: Request, response: Response) {
    // executes update user service
    const { error, message, status, available_usernames, user } = await UpdateUser(request)

    // in case of error
    if(error) return response.status(status).json({
      message,
      available_usernames
    })

    // final response
    return response.status(status).json({
      message,
      user
    })
  },
    
  async delete(request: Request, response: Response) {
    // executes delete user service
    const { error, status, message } = await DeleteUser(request)

    // in case of error
    if(error) return response.status(status).json(message)

    // final response
    return response.status(status).json({
      message
    })
  },
  
  async createAddress(request: Request, response: Response) {
    const { error, status, message, address } = await CreateAddress(request)

    if(error) return response.status(status).json(message)

    return response.status(status).json({
      message,
      address
    })
  }
}