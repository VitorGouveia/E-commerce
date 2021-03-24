import { Request, Response } from "express"
import { User } from "../entities/User"
import { Save as SaveRequest } from "../utils/SaveRequest"

const UserController = {
  create(req: Request, res: Response) {
    SaveRequest(req)

    const { name, email, password } = req.body

    const user = new User({ name, email, password })

    res.json(user)
  }
}

export { UserController }