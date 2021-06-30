import { IItemsRepository } from "@v1/repositories"
import { Item, Rating, Image } from "@v1/entities"

import { Item as ItemType } from "@prisma/client"
import { prisma } from "@src/prisma"

export class SqliteItemsRepository implements IItemsRepository {
  async findById(id: number): Promise<Omit<ItemType, "image" | "rating"> | null> {
    const item = await prisma.item.findUnique({
      where: {
        id
      }
    })

    return item
  }

  async findAll(property?: string, sort?: "asc" | "desc" | string): Promise<ItemType[]> {
    const items = await prisma.item.findMany()
    
    if(property != undefined && sort != "undefined") {
      const items = await prisma.item.findMany({
        orderBy: [{
          [property]: sort
        }]
      })

      return items
    }

    return items
  }

  async findAllPagination(page: number, quantity: number, property?: string, sort?: string): Promise<ItemType[] | Item[] | {}> {
    const items = await prisma.item.findMany({
      take: quantity,
      skip: quantity * page
    })

    if(property != undefined && sort != "undefined") {
      const items = await prisma.item.findMany({
        take: quantity,
        skip: quantity * page,
        orderBy: {
          [property]: sort
        }
      })

      return items
    }

    return items
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