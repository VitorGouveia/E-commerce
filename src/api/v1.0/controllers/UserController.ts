import { Request, Response } from "express"

import { 
  CreateUser,
  ReadUser,
  UpdateUser,
  DeleteUser,
  CreateAddress,
  DeleteAddress,
  CreateCart,
  LoadAdmin
} from "@v1/services/user"

export const UserController = {
  async create(request: Request, response: Response) {
    const { error, message, status, access_token, user } = await CreateUser(request)

    if(error) return response.status(status).json(message)

    // sends JWT through headers
    response.header("authorization", access_token)

    return response.status(status).json({
      message,
      user,
      access_token
    })
  },

  async read(request: Request, response: Response) {
    const { error, message, status, users } = await ReadUser(request)

    if(error) return response.status(status).json(message)

    return response.status(status).json({
      message,
      users
    })
  },
  
  async update(request: Request, response: Response) {
    const { error, message, status, available_usernames, user } = await UpdateUser(request)

    if(error) return response.status(status).json({
      message,
      available_usernames
    })

    return response.status(status).json({
      message,
      user
    })
  },
    
  async delete(request: Request, response: Response) {
    const { error, status, message } = await DeleteUser(request)

    if(error) return response.status(status).json(message)

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
  },

  async deleteAddress(request: Request, response: Response) {
    const { error, status, message } = await DeleteAddress(request)

    if(error) return response.status(status).json(message)

    return response.status(status).json(message)
  },

  async createCart(request: Request, response: Response) {
    const { error, status, message } = await CreateCart(request)

    if(error) return response.status(status).json(message)

    return response.status(status).json(message)
  },

  async deleteCart(request: Request, response: Response) {
  },

  async loadAdmin(request: Request, response: Response) {
    const { error, status, message } = await LoadAdmin(request)

    if(error) return response.status(status).json(message)

    return response.status(status).json(message)
  }
}