import { Request } from "express"

import { IItemsRepository } from "@v1/repositories"
import { SqliteItemsRepository } from "@v1/repositories/implementations"

export class DeleteItemService {
  constructor(
    private itemsRepository: IItemsRepository
  ) {}

  async delete(id: number) {
    try {
      await this.itemsRepository.delete(id)
    } catch (error) {
      throw new Error(error.message)
    }
  }
}

export default async (request: Request) => {
  try {
    const ItemsRepository = new SqliteItemsRepository()
    const DeleteItem = new DeleteItemService(ItemsRepository)

    await DeleteItem.delete(Number(request.params.id))

    return ({
      status: 200,
      message: "Item delete with success!"
    })
  } catch (error) {
    return ({
      error: true,
      status: 400,
      message: "Failed to delete item."
    })
  }
}