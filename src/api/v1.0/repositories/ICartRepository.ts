export interface ICartRepository {
  save(user_id: string, item_id: number): Promise<void>
  delete(user_id: string, id?: number): Promise<void>
}