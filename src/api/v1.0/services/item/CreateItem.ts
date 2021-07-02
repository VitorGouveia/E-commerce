import { Request } from "express"

import { IItemsRepository } from "@v1/repositories"
import { SqliteItemsRepository } from "@v1/repositories/implementations"

import { Item } from "@v1/entities"

export class CreateItemService {
  constructor(
    private itemsRepository: IItemsRepository
  ) {}

  async create(createItemRequest: Item) {
    try {
      const item = new Item(createItemRequest)

      await this.itemsRepository.save(item)

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
    const ItemsRepository = new SqliteItemsRepository()
    const CreateItem = new CreateItemService(ItemsRepository)

    const { item } = await CreateItem.create(request.body)

    return ({
      status: 200,
      item,
      message: "Item created with success!"
    })
  } catch (error) {
    return ({
      error: true,
      status: 400,
      message: error.message
    })
  }
}