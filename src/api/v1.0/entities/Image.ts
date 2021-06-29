export class Image {
  public item_id: number

  public link: string

  constructor(props: Image) {
    Object.assign(this, props)
  }
}