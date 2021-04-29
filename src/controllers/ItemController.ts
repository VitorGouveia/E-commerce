import { Request, Response } from "express"
import { prisma } from "prisma"
import { Save, Index, FindByCategory, FindById, UpdateRating, Update, Delete } from "@database/sqlite/models/ItemModel"

const ItemController = {
  async create(request: Request, response: Response) {
    let { name, short_name, description, price, shipping_price, discount, category, image, orders, rating } = request.body

    var one_star = rating["one_star"]
    var two_star = rating["two_star"]
    var three_star = rating["three_star"]
    var four_star = rating["four_star"]
    var five_star = rating["five_star"]

    try {
      const item = await prisma.item.create({
        data: {
          name,
          short_name,
          description,
          price: String(price),
          shipping_price: String(shipping_price),
          discount: String(discount),
          category,
          image: {
            create: {
              link: image
            }
          },
          orders: String(orders),
          rating: {
            create: {
              one_star,
              two_star,
              three_star,
              four_star,
              five_star
            }
          }
        },

        include: {
          rating: true,
          image: true
        }
      })

      return response.status(200).json({ item })

    } catch (error) {
      
      return response.status(500).json({ message: error.message })
    }
  },

  async createImages(request: Request, response: Response) {

  },

  update(req: Request, res: Response) {
    let { name, short_name, description, price, shipping_price, discount, category, image, orders, rating, uuid } = req.body
    const item = [name, short_name, description, price, shipping_price, discount, category, image, orders, rating, uuid]
    Update(item)

    return res.status(200).json("Item edited.")
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

      return response.status(200).json({
        ratings: {
          one_star: item?.rating?.one_star,
          two_star: item?.rating?.two_star,
          three_star: item?.rating?.three_star,
          four_star: item?.rating?.four_star,
          five_star: item?.rating?.five_star,
          average: Math.floor(
            Number(item?.rating?.one_star) + Number(item?.rating?.two_star) + Number(item?.rating?.three_star) + Number(item?.rating?.four_star) + Number(item?.rating?.five_star)
          ) / 5
        }
      })

    } catch (error) {
      
      return response.status(500).json({ message: error.message })
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
      
      return response.status(500).json({ message: error.message })
    }
  },

  async list(request: Request, response: Response) {
    const { page } = request.params
    let { quantity } = request.body

    try {
      if(request.query.name) {
        // /item?name=headset
        const items = await prisma.item.findMany({
          where: {
            name: {
              contains: String(request.query.name)
            }
          },
          include: {
            image: true,
            rating: true
          },
          take: quantity,
          skip: (Number(page) * Number(quantity))
        })

        return response.status(200).json({ items })
      }

      if(request.query.name && request.query.sort == "desc") {

      } else if(request.query.name && request.query.sort == "asc") {
        // /item?name=headset&sort=asc
      }

      if(!quantity || quantity == null || quantity == undefined) {
        quantity = 0
      } 

      const items = await prisma.item.findMany({
        include: {
          rating: true,
          image: true
        },
        take: quantity,
        skip: (Number(page) * Number(quantity))
      })

      return response.status(302).json({ items })

    } catch (error) {
      
      return response.status(500).json({ message: error.message })
    }
  },

  async delete(request: Request, response: Response) {
    let { id } = request.body

    try {
      await prisma.image.deleteMany({
        where: {
          itemId: id
        }
      })

      await prisma.rating.deleteMany({
        where: {
          itemId: id
        }
      })

      const item = await prisma.item.delete({
        where: {
          id
        }
      })

      return response.status(500).json({ item })
      
    } catch (error) {
      
      return response.status(500).json({ message: error.message })
    }
  }
}

export { ItemController }