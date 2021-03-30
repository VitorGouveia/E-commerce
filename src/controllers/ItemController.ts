import { Request, Response } from "express"
import { Item } from "../entities/Item"
import { Save, Index, FindByCategory, Update, Delete } from "../database/models/ItemModel"

const ItemController = {
  create(req: Request, res: Response) {
    let { name, short_name, description, price, shipping_price, discount, category, image, orders } = req.body

    const item = new Item({ name, short_name, description, price, shipping_price, discount, category,image, orders })

    Save(item)
    return res.status(200).json(item)
  },

  list(req: Request, res: Response) {
    Index((rows: any) => {
      return res.status(200).json(rows)
    })
  },

  findByCategory(req: Request, res: Response) {
    let { category } = req.params

    FindByCategory(category, (rows: any) => {
      return res.status(302).json(rows)
    })
  },

  edit(req: Request, res: Response) {
    let { uuid } = req.body
  },

  delete(req: Request, res: Response) {
    let { uuid } = req.body

    Delete(uuid)

    return res.status(200).json("item deleted.")
  }
}

export { ItemController }