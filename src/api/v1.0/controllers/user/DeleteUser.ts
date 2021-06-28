import { Request, Response } from "express"

export default async (request: Request, response: Response) => {
  try {
    
  } catch (error) {
    return ({
      error: true,
      status: 400,
      message: "Failed to create user."
    })
  }
}