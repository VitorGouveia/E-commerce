import { ICartRepository } from "@v1/repositories"

import { prisma } from "@src/prisma"

export class SqliteCartRepository implements ICartRepository {
  async save(user_id: string, item_id: number): Promise<void> {
    await prisma.cart.create({
      data: {
        item_id,
        user_id
      }
    })
  }

  async delete(user_id: string, id?: number): Promise<void> {
    if(id != undefined && user_id != undefined) {
      await prisma.cart.deleteMany({
        where: {
          id,
          user_id
        }
      })

      return
    }

    await prisma.cart.deleteMany({
      where: {
        user_id
      }
    })
  }
}