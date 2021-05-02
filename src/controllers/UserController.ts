import { Request, Response } from "express"
import jwt from "jsonwebtoken"
import { prisma } from "../prisma"
import { User } from "@prisma/client"
import { hash } from "bcrypt"

const UserController = {
  async create(request: Request, response: Response) {
    let { name, email, cpf, password }: User  = request.body

    try {
      password = await hash(password, 10)
  
      const userExists = await prisma.user.findMany({
        where: {
          email: {
            equals: email
          }
        }
      })
  
      if(userExists.length > 1) {
        return response.status(400).json({
          auth: false, message: "User already exists", userExists
        })
      }

      const user = await prisma.user.create({
        data: {
          name,
          email,
          cpf,
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

      return response.status(500).json({ error: error.name, details: { message: error.message } })
    }
  },

  async update(request: Request, response: Response) {
    const { id, name, last_name, cpf, email, password } = request.body

    const authorizationHeader = request.headers.authorization

    if(!authorizationHeader) {
      return response.status(400).json({ auth: false, message: "No JWT token was found! Redirect to login" })
    }
    
    try {
      jwt.verify(String(authorizationHeader), String(process.env.JWT_REFRESH_TOKEN))
      const user = await prisma.user.update({
        where: {
          id: id
        },

        data: {
          name,
          last_name,
          cpf,
          email,
          password
        },

        include: {
          address: true
        }
      })

      return response.status(200).json({ auth: true, user, message: "User edited with success!" })

    } catch (error) {

      return response.status(400).json({ 
        auth: false, 
        message: error.message 
      })
    }
  },

  async createAddress(request: Request, response: Response) {
    const { userId, postalCode, city, state, street, number } = request.body

    try {
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

      return response.status(200).json({ address })

    } catch (error) {
      
      return response.status(500).json({ error: error.name, details: { message: error.message } })
    }
  },

  async delete(request: Request, response: Response) {
    const { id } = request.body

    const authHeader = request.headers.authorization

    if(!authHeader) {
      return response.status(400).json({ auth: false, message: "No JWT token was found! Redirect to login" })
    }
    
    try {
      const JWTHeader = jwt.verify(String(authHeader), String(process.env.JWT_REFRESH_TOKEN))
      await prisma.address.deleteMany({
        where: {
          userId: id
        }
      })

      const user = await prisma.user.delete({
        where: {
          id
        }
      })

      return response.status(200).json({ auth: true, JWTHeader, user, message: "User deleted with success!" })

    } catch (error) {

      return response.status(500).json({ error: error.name, details: { message: error.message } })
    }
  },

  async list(request: Request, response: Response) {
    let { page } = request.params
    let { quantity } = request.body
    
    try {
      if(request.query.name) {
        // dashboard/user?name=vitor
        // returns users that contain name vitor
        const users = await prisma.user.findMany({
          where: {
            name: {
              contains: String(request.query.name)
            }
          },
          include: {
            address: true
          },
          take: quantity,
          skip: (Number(page) * Number(quantity))
        })

        return response.status(200).json({ users })
      }

      if(request.query.name && request.query.sort == "desc") {
        // dashboard/user?name=vitor&sort=desc
        const users = await prisma.user.findMany({
          orderBy: [{
            name: "desc"
          }],
          include: {
            address: true
          },
          take: quantity,
          skip: (Number(page) * Number(quantity))
        })

        return response.status(200).json({ users })
      } else if (request.query.name && request.query.sort == "asc") {
        // dashboard/user?name=vitor&sort=asc
        const user = await prisma.user.findMany({
          orderBy: [{
            name: "asc"
          }],
          include: {
            address: true
          },
          take: quantity,
          skip: (Number(page) * Number(quantity))
        })

        return response.status(200).json({ user })
      }

      if(!quantity) quantity = 0

      const users = await prisma.user.findMany({
        include: {
          address: true
        },
        take: quantity,
        skip: (Number(page) * Number(quantity))
      })

      return response.status(200).json(users)

    } catch (error) {
      
      return response.status(500).json({ error: error.name, details: { message: error.message } })
    }
  }
}

export { UserController }