import { isIpBanned } from "@v1/utils/IsIpBanned"

import { Request, Response, NextFunction } from "express"

export default (request: Request, response: Response, next: NextFunction) => {
  try {
    const { ip } = request

    const isBanned = isIpBanned(ip)

    if(isBanned == true) {
      throw new Error("Your ip is banned")
    }

    next()
  } catch (error) {
    return response.status(403).json(error.message)
  }
}