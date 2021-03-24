import { Request, Response } from "express"

const UserController = {
  create(req: Request, res: Response) {
    const { name, email, password } = req.body

    res.json({ name, email, password })
  }
}

export { UserController }