import { Request, Response} from "express"

import { prisma } from "@src/prisma"

import { User, randomNumber } from "../../entities/User"

import auth from "@auth"

type createUserResponse = {
  userHashAlreadyExists: string
  userAlreadyExists: User
  access_token: string
  user: User
}

// create user service is responsible for authentication and some rules
const create = async (userRequest: User) => {
  try {
    // creates user
    const {
      id,
      created_at,
      name,
      email,
      password,
      userhash,
      username
    } = new User(userRequest)

    // searches for duplicate user hash
    const userHashAlreadyExists = await prisma.user.findMany({
      where: {
        name,
        userhash
      }
    })
    
    // searches users with that e-mail
    const userAlreadyExists = await prisma.user.findMany({
      where: {
        email
      }
    })
    
    // if user with same email exists
    if(userAlreadyExists.length) {
      return {
        userAlreadyExists
      }
    }
    // stores user in the database
    const user = await prisma.user.create({
      data: {
        id,
        created_at,
        name,
        username,
        userhash,
        email,
        password
      }
    })
    
    // creates JWT access token
    const access_token = auth.create(user, "24h")
    
    return {
      userHashAlreadyExists,
      access_token,
      user
    }
  } catch (error) {
    return error
  }
}

// just return everything from create user service
export default async (request: Request, response: Response) => {
  try {
    const { 
      userHashAlreadyExists,
      userAlreadyExists,
      access_token,
      user 
    }: createUserResponse = await create(request.body)

    // if user with name and hash already exist generate another hash
    userHashAlreadyExists && (
      user.userhash = randomNumber(4)
    )

    // checks if user with that email already exists
    if (userAlreadyExists) return ({
      error: true,
      status: 400,
      message: "User already exists."
    })

    // respond with user information
    return ({
      status: 201,
      access_token,
      user,
      message: "User created with success!"
    })

  } catch (error) {
    // in case of error, send error details
    return ({
      error: true,
      status: 400,
      message: "Failed to create user."
    })
  }
}