import { Request } from "express"

import { IItemsRepository } from "@v1/repositories"
import { SqliteItemsRepository } from "@v1/repositories/implementations"

import { Rating } from "@v1/entities"

export class RateItemService {
  constructor(
    private itemsRepository: IItemsRepository
  ) {}

  async rate(id: number, rateItemRequest: Rating) {
    try {
      const rating = new Rating(rateItemRequest, id)

      const {
        one_star,
        two_star,
        three_star,
        four_star,
        five_star
      } = await this.itemsRepository.rate(rating)

      const item = { one_star, two_star, three_star, four_star, five_star }

      const allNumberRatings = (
        (one_star * 1) +
        (two_star * 2) +
        (three_star * 3) +
        (four_star * 4) +
        (five_star * 5)
      )

      const allRatings = one_star + two_star + three_star + four_star + five_star

      const average = Math.floor(allNumberRatings / allRatings)

      return {
        item,
        average
      }
    } catch (error) {
      throw new Error(error.message)
    }
  }
}

export default async (request: Request) => {
  try {
    const ItemsRepository = new SqliteItemsRepository()
    const RateItem = new RateItemService(ItemsRepository)

    const { item, average } = await RateItem.rate(Number(request.params.id), request.body)

    return ({
      status: 200,
      item,
      average,
      message: "Rated item with success!"
    })
    
  } catch (error) {
    return ({
      error: true,
      status: 400,
      message: "Failed to rate item."
    })
  }
}