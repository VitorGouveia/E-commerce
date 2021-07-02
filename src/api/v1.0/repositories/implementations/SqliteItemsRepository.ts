import { IItemsRepository } from "@v1/repositories"
import { Item, Rating, Image } from "@v1/entities"

import { Item as ItemType, Rating as RatingType } from "@prisma/client"
import { prisma } from "@src/prisma"

export class SqliteItemsRepository implements IItemsRepository {
  async findById(id: number): Promise<Omit<ItemType, "image" | "rating"> | null> {
    const item = await prisma.item.findUnique({
      where: {
        id
      },

      include: {
        rating: {
          select: {
            id: true,
            one_star: true,
            two_star: true,
            three_star: true,
            four_star: true,
            five_star: true,
          }
        },
        image: {
          select: {
            id: true,
            link: true
          }
        }
      }
    })
    
    return item
  }

  async findAll(category?: string, property?: string, sort?: "asc" | "desc" | string): Promise<ItemType[]> {
    const items = await prisma.item.findMany()
    
    if(category != "undefined" && property != undefined && sort != undefined) {
      const items = await prisma.item.findMany({
        orderBy: [{
          [property]: sort
        }],
        where: {
          category
        }
      })
      
      return items
    }

    if(category != "undefined") {
      const items = await prisma.item.findMany({
        where: {
          category
        }
      })

      return items
    }

    if(property != undefined && sort != undefined) {
      const items = await prisma.item.findMany({
        orderBy: [{
          [property]: sort
        }]
      })
      
      return items
    }


    return items
  }

  async findAllPagination(page: number, quantity: number, category?: string, property?: string, sort?: string): Promise<ItemType[] | Item[] | []> {
    const items = await prisma.item.findMany({
      take: quantity,
      skip: quantity * page
    })

    if(category != "undefined" && property != undefined && sort != undefined) {
      const items = await prisma.item.findMany({
        orderBy: [{
          [property]: sort
        }],
        where: {
          category
        },
        take: quantity,
        skip: quantity * page
      })
      
      return items
    }

    if(category != "undefined") {
      const items = await prisma.item.findMany({
        where: {
          category
        },
        take: quantity,
        skip: quantity * page
      })

      return items
    }

    if(property != undefined && sort != undefined) {
      const items = await prisma.item.findMany({
        orderBy: [{
          [property]: sort
        }],
        take: quantity,
        skip: quantity * page
      })
      
      return items
    }

    return items
  }

  async rate(rating: Rating): Promise<Rating> {
    const {
      item_id,
      one_star,
      two_star,
      three_star,
      four_star,
      five_star
    } = rating

    const oldRating = await prisma.rating.findMany({
      where: {
        item_id
      }
    })

    if(oldRating == undefined || oldRating == null) {
      const itemRating = await prisma.rating.create({
        data: {
          item_id,
          one_star,
          two_star,
          three_star,
          four_star,
          five_star
        }
      })

      return itemRating
    }

    const itemRating = await prisma.rating.update({
      where: {
        id: 1
      },

      data: {
        item_id,
        one_star: one_star + oldRating[0].one_star,
        two_star: two_star + oldRating[0].two_star,
        three_star: three_star + oldRating[0].three_star,
        four_star: four_star + oldRating[0].four_star,
        five_star: five_star + oldRating[0].five_star
      }
    })

    return itemRating
  }
  
  async update(id: number, { ...props }: Item): Promise<ItemType> {
    const item = await prisma.item.update({
      where: {
        id
      },

      data: {
        ...props
      }
    })

    return item
  }

  async save(item: Item): Promise<void> {
    const {
      created_at,
      name,
      short_name,
      description,
      price,
      shipping_price,
      discount,
      category
    } = item

    await prisma.item.create({
      data: {
        created_at,
        name,
        short_name,
        description,
        price,
        shipping_price,
        discount,
        category
      }
    })
  }

  async delete(id: number): Promise<void> {
    await prisma.item.delete({
      where: {
        id
      }
    })
  }
}