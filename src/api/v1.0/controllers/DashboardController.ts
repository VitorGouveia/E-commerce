import { Request, Response } from "express"

import { LoadFile } from "@v1/services/item"

export const DashboardController = {
  async loadFromFile(request: Request, response: Response) {
    const { error, status, message } = await LoadFile(request)

    if(error) return response.status(status).json(message)

    return response.status(status).json({
      message,
    })
  }
}