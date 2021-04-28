import { Request, Response } from "express"
import { Item } from "@entities/Item"
import { Save, Index, FindByCategory, FindById, UpdateRating, Update, Delete } from "@database/sqlite/models/ItemModel"

const ItemController = {
  create(req: Request, res: Response) {
    let { name, short_name, description, price, shipping_price, discount, category, image, orders, rating } = req.body

    const item = new Item({ name, short_name, description, price, shipping_price, discount, category,image, orders, rating })
    rating = rating / 10
    Save(item)
    return res.status(200).json(item)
  },

  list(req: Request, res: Response) {
    const { id } = req.params

    Index((rows: any) => {
      return res.status(200).json(rows)
    }, Number(id))
  },

  findByCategory(req: Request, res: Response) {
    let { category } = req.params

    FindByCategory(category, (rows: any) => {
      return res.status(302).json(rows)
    })
  },

  edit(req: Request, res: Response) {
    let { name, short_name, description, price, shipping_price, discount, category, image, orders, rating, uuid } = req.body
    const item = [name, short_name, description, price, shipping_price, discount, category, image, orders, rating, uuid]
    Update(item)

    return res.status(200).json("Item edited.")
  },

  rate(req: Request, res: Response) {
    let { uuid, rating } = req.body

    rating = rating / 10

    FindById(uuid, rows => {

      const newRating = rows.rating - rating
      UpdateRating(newRating, uuid)
      return res.json(newRating / 2)
    })

  },

  delete(req: Request, res: Response) {
    let { uuid } = req.body

    Delete(uuid)

    return res.status(200).json("Item deleted.")
  }
}

export { ItemController }