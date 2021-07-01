import { Request, Response } from "express"

import { prisma } from "@src/prisma"
import { CreateItem, ReadItem, UpdateItem, DeleteItem, RateItem, CreateImage, DeleteImage } from "@v1/services/item"

export const ItemController = {
  async create(request: Request, response: Response) {
    const { error, status, message, item } = await CreateItem(request)

    if(error) return response.status(status).json(message)

    return response.status(status).json({
      message,
      item
    })
  },

  async read(request: Request, response: Response) {
    const { error, status, message, items } = await ReadItem(request)

    if(error) return response.status(status).json(message)

    return response.status(status).json({
      message,
      items
    })
  },

  async update(request: Request, response: Response) {
    const { error, status, message, item } = await UpdateItem(request)

    if(error) return response.status(status).json(message)

    return response.status(status).json({
      message,
      item
    })
  },

  async delete(request: Request, response: Response) {
    const { error, status, message } = await DeleteItem(request)

    if(error) return response.status(status).json(message)

    return response.status(status).json(message)
  },

  async rateItem(request: Request, response: Response) {
    const { error, status, message, item, average } = await RateItem(request)

    if(error) return response.status(status).json(message)

    return response.status(status).json({
      message,
      average,
      item
    })
  },

  async createImage(request: Request, response: Response) {
    const { error, status, message, image } = await CreateImage(request)

    if(error) return response.status(status).json(message)

    return response.status(status).json({
      message,
      image
    })
  },

  async removeImage(request: Request, response: Response) {
    const { error, status, message } = await DeleteImage(request)

    if(error) return response.status(status).json(message)

    return response.status(status).json(message)
  }
}