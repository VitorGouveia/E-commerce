import { Item, Rating, Image } from "@v1/entities"

export interface IItemsRepository {
  save(item: Item): Promise<void>
  delete(id: number): Promise<void>
}