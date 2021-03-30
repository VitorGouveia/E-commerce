import { Request, Response } from "express"
import { Delete } from "../database/models/UserModel"

const DashboardController = {
  deleteUser(req: Request, res: Response) {
    let { uuid, password } = req.body

    Delete([uuid, password])

    return res.status(200).json("user deleted.")
  }
}

export { DashboardController }