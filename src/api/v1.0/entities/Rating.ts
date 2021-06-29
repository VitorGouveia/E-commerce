export class Rating {
  public readonly item_id: number

  public one_star: number
  public two_star: number
  public three_star: number
  public four_star: number
  public five_star: number

  constructor(props: Rating) {
    Object.assign(this, props)
  }
}