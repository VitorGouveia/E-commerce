import { Request, Response } from "express"

import { prisma } from "@src/prisma"

import { handle } from "@v1/utils/ErrorHandler"

import { CreateUser, ReadUser, UpdateUser, DeleteUser } from "./user"

export const UserController = {
  async create(request: Request, response: Response) {
    // executes create user service
    const { error, message, status, access_token, user } = await CreateUser(request, response)
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
    const { error, message, status, users } = await ReadUser(request, response)

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
    const { error, message, status, available_usernames, user } = await UpdateUser(request, response)

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
    const { error, status, message } = await DeleteUser(request, response)

    // in case of error
    if(error) return response.status(status).json({
      message
    })

    // final response
    return response.status(status).json({
      message
    })
  },
  
  async createAddress(request: Request, response: Response) {
    const { userId, postalCode, city, state, street, number } = request.body
    
    try {
      // create user related address
      const address = await prisma.address.create({
        data: {
          userId,
          postalCode,
          city,
          state,
          street,
          number
        },
      })
      
      // respond with address information
      return response.status(200).json({ address })
      
    } catch (error) {
      
      // in case of error send error details
      return handle.express(400, { message: "Failed to create address." })
    }
  }
}