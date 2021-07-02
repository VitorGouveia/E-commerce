import { Request } from "express"

import { IItemsRepository } from "@v1/repositories"
import { SqliteItemsRepository } from "@v1/repositories/implementations"

import { Item } from "@v1/entities"

class LoadFileService {
  constructor(
    private itemsRepository: IItemsRepository
  ) {}

  async load(items: Item[]) {
    try {
      items.forEach(async (item: Item) => {
        const newItem = new Item(item)
        await this.itemsRepository.save(newItem)
      })

      return
    } catch (error) {
      throw new Error(error.message)
    }
  }
}

export default async (request: Request) => {
  try {
    const itemsRepository = new SqliteItemsRepository()
    const LoadFile = new LoadFileService(itemsRepository)

    await LoadFile.load(request.body)

    return ({
      status: 200,
      message: "Loaded items from file with success!"
    })
  } catch (error) {
    return ({
      error: true,
      status: 400,
      message: "Failed to load items from file."
    })
  }
}