export class Cart {
  public readonly user_id: string

  public item_id: number

  constructor(user_id: string, item_id: number) {
    this.user_id = user_id
    this.item_id = item_id
  }
}