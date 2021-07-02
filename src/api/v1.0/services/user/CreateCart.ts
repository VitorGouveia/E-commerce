import { Request } from "express"

import { ICartRepository } from "@v1/repositories"
import { SqliteCartRepository } from "@v1/repositories/implementations"

class CreateCartService {
  constructor(
    private cartRepository: ICartRepository
  ) {}

  async create(user_id: string, { item_id }: any) {
    try {
      await this.cartRepository.save(user_id, item_id)
    } catch (error) {
      throw new Error(error.message)
    }
  }
}

export default async (request: Request) => {
  try {
    const cartRepository = new SqliteCartRepository()
    const CartService = new CreateCartService(cartRepository)

    await CartService.create(request.params.id, request.body)

    return ({
      status: 201,
      message: "Cart item created with success!"
    })

  } catch (error) {
    return ({
      error: true,
      status: 400,
      message: "Failed to create cart"
    })
  }
}