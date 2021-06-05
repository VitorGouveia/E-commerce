import { Response } from "express"

var err: Error
var response: Response

const handle = {
  express(status: number, message: Object) {
    return response
      .status(status)
      .json({
        message,
        error: err.name,
        details: {
          message: err.message
        }
      })
  }
}

export { handle }