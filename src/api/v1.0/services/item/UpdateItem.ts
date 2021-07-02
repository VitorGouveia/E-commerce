import { Request } from "express"

import { IItemsRepository } from "@v1/repositories"
import { SqliteItemsRepository } from "@v1/repositories/implementations"

import { Item } from "@v1/entities"

export class UpdateItemService {
  constructor(
    private itemsRepository: IItemsRepository
  ) {}

  async read(id: number, updateItemRequest: Item) {
    try {
      const item = await this.itemsRepository.update(id, updateItemRequest)

      return {
        item
      }
    } catch (error) {
      throw new Error(error.message)
    }
  }
}

export default async (request: Request) => {
  try {
    // create sqlite repository
    const ItemsRepository = new SqliteItemsRepository()

    // create update item service
    const UpdateItem = new UpdateItemService(ItemsRepository)

    // execute item service
    const { item } = await UpdateItem.read(Number(request.params.id), request.body)
    // respond with item information
    return ({
      status: 202,
      message: "Updated item with success!",
      item
    })

  } catch (error) {
    // in case of error
    return ({
      error: true,
      status: 400,
      message: "Failed to update item."
    })
  }
}