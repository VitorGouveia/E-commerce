import { IItemsRepository } from "@v1/repositories"
import { Item, Rating, Image } from "@v1/entities"

import { prisma } from "@src/prisma"

export class SqliteItemsRepository implements IItemsRepository {
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

  async delete(id: number): Promise<void> {}
}