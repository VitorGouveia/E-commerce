import { Request, Response } from "express"
import { Delete } from "@database/models/UserModel"

const DashboardController = {
  deleteUser(req: Request, res: Response) {
    let { uuid } = req.body

    Delete(uuid)

    return res.status(200).json("user deleted.")
  }
}

export { DashboardController }