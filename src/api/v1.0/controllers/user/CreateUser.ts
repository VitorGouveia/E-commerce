import { Request, Response} from "express"

import { User } from "@prisma/client"
import { prisma } from "@src/prisma"

import { hash, genSalt } from "bcrypt"

import auth from "@auth"

type createUserResponse = {
  userHashAlreadyExists: string
  userAlreadyExists: User
  access_token: string
  user: User
}

export function randomNumber(num: number) {
  var add = 1
  var max = 12 - add
  
  if(num > max) {
    return randomNumber(max) + randomNumber(Number(num) - max)
  }
  
  max = Math.pow(10, num + add)
  var min = max / 10
  var number = Math.floor(Math.random() * (max - min + 1)) + min
  
  return ("" + number).substring(add)
}

// create user service is responsible for authentication and some rules
const create = async ({ name, email, cpf, password }: User) => {
  try {
    // TODO: integrate this with discord user hash
    let userhash = randomNumber(4)
    
    // searcher for duplicate user hash
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

    if(userAlreadyExists.length) {
      return {
        userAlreadyExists
      }
    }

    const salt = await genSalt(10)
    password = await hash(password, salt)

    const username = `${name}${randomNumber(2)}`

    // stores user in the database
    const user = await prisma.user.create({
      data: {
        name,
        email,
        cpf,
        password,
        username,
        userhash,
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