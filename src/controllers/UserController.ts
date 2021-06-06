import { Request, Response } from "express"

import { hash } from "bcrypt"

import { prisma } from "../prisma"
import { User } from "@prisma/client"

import { auth } from "@auth/JWT"
import { handle } from "@utils/ErrorHandler"
import { generateHash } from "@utils/Hash"

const UserController = {
  async create(request: Request, response: Response) {
    let { name, email, cpf, password }: User = request.body
    
    try {
      // TODO: integrate this with discord user hash
      let userhash = generateHash(4)
      
      // searches users with that hash and name
      const userHashAlreadyExists = await prisma.user.findMany({
        where: {
          name,
          userhash: String(userhash)
        }
      })
      
      // if user with name and hash already exist add 1 to userhash
      if(userHashAlreadyExists) {
        userhash = generateHash(4)
      }
      
      password = await hash(password, 10)
      
      // searches users with that e-mail
      const userAlreadyExists = await prisma.user.findMany({
        where: {
          email
        }
      })
      
      // checks if user with that email already exists
      if (userAlreadyExists.length) {
        return response.status(400).json({
          auth: false, message: "User already exists", user: userAlreadyExists
        })
      }
      
      
      // stores user in the database
      const user = await prisma.user.create({
        data: {
          name,
          lastname: "",
          username: `${name}${generateHash(2)}`,
          userhash: String(userhash),
          cpf,
          email,
          password
        }
      })
      
      // creates JWT access token
      const access_token = auth.create(user, "24h")
      
      // sends JWT through headers
      response.header("authorization", access_token)
      
      // respond with user information
      return response.status(201).json({ auth: true, access_token, user, message: "User created with success!" })
      
    } catch (error) {
      
      // in case of error, send error details
      return handle.express(500, { auth: false, message: "Failed to create user." })
    }
  },
  
  async update(request: Request, response: Response) {
    const { name, lastname, username, userhash, cpf, email, password } = request.body
    const { id } = request.params
    
    // searches a JWT authorization token in client's headers
    const authorizationHeader = request.headers.authorization
    
    // if JWT authorization token doesn't exist, send error
    if (!authorizationHeader) {
      return response.status(400).json({ auth: false, message: "No JWT token was found! Redirect to login" })
    }

    try {
      // searches user with the same username and userhash
      const usernameAlreadyExists = await prisma.user.findMany({
        where: {
          username,
          userhash
        },

        // select less user properties to reduce response time
        select: {
          id: true,
          username: true,
          userhash: true
        }
      })

      // responds if you choose the same name twice
      if(usernameAlreadyExists[0]?.username == username) {
        return response.status(400).json({
          message: "You took this username"
        })
      }

      // if there is a user with the same username and userhash respond with other available usernames
      if(usernameAlreadyExists.length > 0) {
        return response.status(400).json({ 
          message: "This username is already taken",
          available_usernames: [
            { username: `${username}${generateHash(2)}` },
            { username: `${name}${generateHash(2)}` }
          ]
        })
      }

      // check if JWT authorization token is valid
      auth.verify(authorizationHeader)
      
      // updates user
      const user = await prisma.user.update({
        where: {
          id
        },
        
        data: {
          name,
          lastname,
          username: `${username}`,
          cpf,
          email,
          password
        }
      })
      
      // respond with user information
      return response.status(200).json({ auth: true, user, message: "User updated with success!" })
      
    } catch (error) {
      
      // in case of error send error details
      return handle.express(400, { auth: false, message: "Failed to update user." })
    }
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
  },
  
  async delete(request: Request, response: Response) {
    const { id } = request.body
    
    // searches a JWT authorization token in client's headers
    const authorizationHeader = request.headers.authorization
    
    if (!authorizationHeader) {
      // if JWT authorization token doesn't exist, send error
      return response.status(400).json({ auth: false, message: "No JWT token was found! Redirect to login" })
    }
    
    try {
      // check if JWT authorization token is valid
      auth.verify(authorizationHeader)
      
      // deletes all users addresses to avoid Prisma error
      await prisma.address.deleteMany({
        where: {
          userId: id
        }
      })
      
      // deletes user
      const user = await prisma.user.delete({
        where: {
          id
        }
      })
      
      // respond with user information
      return response.status(200).json({ auth: false, user, message: "User deleted with success!" })
      
    } catch (error) {
      
      // in case of error send error details
      return handle.express(500, { auth: false, message: "failed to delete user." })
    }
  },
  
  async list(request: Request, response: Response) {
    let page = Number(request.query.page)
    let quantity = Number(request.query.quantity)
    let name = String(request.query.name)
    let sort: any = String(request.query.sort) || "desc" || "asc"
    let created_at = String(request.query.createdAt)
    let userId = String(request.params.id)
    
    try {
      if(userId != "undefined") {
        const user = await prisma.user.findUnique({
          where: {
            id: userId
          }
        })
        
        return response.status(200).json(user)
      }
      
      if(!page && !quantity) {
        const users = await prisma.user.findMany()
        
        return response.json(users)
      }
      
      if(name != "undefined") {
        
        if(sort != "undefined") {
          const users = await prisma.user.findMany({
            orderBy: [{
              name: sort
            }],
            
            include: {
              address: true
            },
            
            take: quantity,
            skip: (page * quantity)
          })
          
          return response.status(200).json(users)
        }
        
        const users = await prisma.user.findMany({
          where: {
            name: {
              contains: name
            }
          },
          
          include: {
            address: true
          },
          
          take: quantity,
          skip: (page * quantity)
        })
        
        return response.status(200).json(users)
      }
      
      if(name == "undefined" && created_at == "true" && sort != "undefined") {
        const users = await prisma.user.findMany({
          orderBy: [{
            created_at: sort
          }],
          
          include: {
            address: true
          },
          
          take: quantity,
          skip: (page * quantity)
        })
        
        return response.status(200).json(users)
      }
      
      const users = await prisma.user.findMany({
        include: {
          address: true
        },
        
        take: quantity,
        skip: page * quantity
      })
      
      return response.status(200).json(users)
      
    } catch (error) {
      return handle.express(500, { message: "failed to list users." }) 
    }
  }
}

export { UserController }