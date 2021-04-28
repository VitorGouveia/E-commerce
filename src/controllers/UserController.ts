import jwt from "jsonwebtoken"
import { Request, Response } from "express"
import { Save as SaveRequest } from "@utils/SaveRequest"
import { prisma } from "../prisma"
import { User } from "@prisma/client"
import { hash } from "bcrypt"

const UserController = {
  async create(request: Request, response: Response) {
    SaveRequest(request)

    let { name, email, password }: User  = request.body
    password = await hash(password, 20)

    const userExists = await prisma.user.findMany({
      where: {
        email
      }
    })

    if(userExists) {
      return response.status(400).json({
        auth: false, message: "User already exists", userExists
      })
    }
    try {

      const user = await prisma.user.create({
        data: {
          name,
          email,
          password
        }
      })
  
      const access_token = jwt.sign({ 
        id: user.id, 
        name, 
        email, 
        password: user.password 
      }, String(process.env.JWT_ACCESS_TOKEN), { expiresIn: "24h" })
  
      response.header("authorization", access_token)
  
      return response.status(201).json({ auth: true, access_token, user, message: "User created with success!" })
      
    } catch (error) {

      return response.status(500).json({
        message: error.message
      })
    }
  },

  async updateUser(request: Request, response: Response) {
    SaveRequest(request)

    const { id, name, last_name, cpf, email, password, address } = request.body

    const authorizationHeader = request.headers.authorization
    
    try {
      const JWTHeader = jwt.verify(String(authorizationHeader), String(process.env.JWT_REFRESH_TOKEN))
      const user = await prisma.user.update({
        where: {
          id
        },

        data: {
          name,
          last_name,
          cpf,
          email,
          password,
          address
        }
      })

      return response.status(200).json({ auth: true, JWTHeader, user, message: "User edited with success!" })

    } catch (error) {

      return response.status(400).json({ 
        auth: false, 
        message: error.message 
      })
    }
  },

  async delete(request: Request, response: Response) {
    SaveRequest(request)

    const { id } = request.body

    const authHeader = request.headers.authorization
    
    try {
      const JWTHeader = jwt.verify(String(authHeader), String(process.env.JWT_REFRESH_TOKEN))
      const user = await prisma.user.delete({
        where: {
          id
        }
      })

      return response.status(200).json({ auth: true, JWTHeader, user, message: "User deleted with success!" })

    } catch (error) {

      return response.status(400).json({ 
        auth: false, 
        message: error.message
      })
    }
  },

  async list(request: Request, response: Response) {
    SaveRequest(request)

    const { page } = request.params
    let { quantity } = request.body

    
    try {
      if(!quantity) quantity = 0

      const users = await prisma.user.findMany({
        take: quantity,
        skip: (Number(page) * Number(quantity))
      })

      return response.status(200).json(users)

    } catch (error) {
      
      return response.status(500).json({ message: error.message })
    }
  }
}

export { UserController }