import { Request, Response } from "express"

import { prisma } from "@src/prisma"
import { CreateItem, ReadItem, UpdateItem, DeleteItem } from "@v1/services/item"

const ItemController = {
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
    let { itemId, one_star, two_star, three_star, four_star, five_star } = request.body

    try {
      const oldRating = await prisma.rating.findMany({
        where: {
          itemId
        }
      })

      one_star = Number(one_star) + Number(oldRating[0].one_star)
      two_star = Number(two_star) + Number(oldRating[0].two_star)
      three_star = Number(three_star) + Number(oldRating[0].three_star)
      four_star = Number(four_star) + Number(oldRating[0].four_star)
      five_star = Number(five_star) + Number(oldRating[0].five_star)

      const rating = await prisma.rating.updateMany({
        where: {
          itemId
        },
        data: {
          itemId,
          one_star: String(one_star),
          two_star: String(two_star),
          three_star: String(three_star),
          four_star: String(four_star),
          five_star: String(five_star)
        }
      })

      return response.status(200).json({ rating })

    } catch (error) {

      return response.status(500).json({ error: error.name, details: { message: error.message } })
    }
  },

  async createImage(request: Request, response: Response) {
    const { itemId, link } = request.body

    try {
      const image = await prisma.image.create({
        data: {
          itemId,
          link
        }
      })

      return response.status(200).json({ image })

    } catch (error) {

      return response.status(500).json({ error: error.name, details: { message: error.message } })
    }
  },

  async removeImage(request: Request, response: Response) {
    const { id } = request.body

    try {
      const image = await prisma.image.delete({
        where: {
          id
        }
      })

      return response.status(200).json({ image })

    } catch (error) {

      return response.status(500).json({ error: error.name, details: { message: error.message } })
    }
  },

  async listRating(request: Request, response: Response) {
    const { id } = request.body

    try {
      const item = await prisma.item.findUnique({
        where: {
          id
        },

        select: {
          rating: true
        }
      })

      let allNumberRatings = (Number(item?.rating?.one_star) * 1) + (Number(item?.rating?.two_star) * 2) + (Number(item?.rating?.three_star) * 3) + (Number(item?.rating?.four_star) * 4) + (Number(item?.rating?.five_star) * 5)
      let allRatings = Number(item?.rating?.one_star) + Number(item?.rating?.two_star) + Number(item?.rating?.three_star) + Number(item?.rating?.four_star) + Number(item?.rating?.five_star)

      return response.status(200).json({
        ratings: {
          one_star: item?.rating?.one_star,
          two_star: item?.rating?.two_star,
          three_star: item?.rating?.three_star,
          four_star: item?.rating?.four_star,
          five_star: item?.rating?.five_star,
          average: Math.floor(allNumberRatings / allRatings)
        }
      })

    } catch (error) {

      return response.status(500).json({ error: error.name, details: { message: error.message } })
    }
  },

  async findByCategory(request: Request, response: Response) {
    let { category } = request.params

    try {
      const items = await prisma.item.findMany({
        where: {
          category
        }
      })

      return response.status(302).json({ items })

    } catch (error) {

      return response.status(500).json({ error: error.name, details: { message: error.message } })
    }
  }
}

export { ItemController }