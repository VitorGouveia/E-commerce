import { IImageRepository } from "@v1/repositories"
import { Image } from "@v1/entities"

import { prisma } from "@src/prisma"

export class SqliteImageRepository implements IImageRepository {
  async save(id: number, image: Image): Promise<void> {
    const { link } = image

    await prisma.item.update({
      where: {
        id
      },

      data: {
        image: {
          create: {
            link
          }
        }
      }
    })
  }

  async delete(id: number, item_id: number): Promise<void> {
    await prisma.image.deleteMany({
      where: {
        id,
        item_id
      }
    })
  }
}