import jwt from "jsonwebtoken"
import { Request, Response } from "express"
import { Save, Index, FindByEmail, Update, Delete } from "../database/models/UserModel"
import { User } from "../entities/User"
import { Save as SaveRequest } from "../utils/SaveRequest"

const UserController = {
  create(req: Request, res: Response) {
    SaveRequest(req)

    const { name, email, password } = req.body
    
    FindByEmail(email, rows => {
      if(rows.length > 0) {
        return res.status(400).json({ auth: false, message: "User with this email already exists." })
      }

      const user = new User({ name, email, password })

      Save(user)

      const access_token = jwt.sign({ uuid: user.uuid, name, email, password: user.password }, String(process.env.JWT_ACCESS_TOKEN), { expiresIn: "24h" })

      res.header("authorization", access_token)
      return res.json({ auth: true, user, access_token })
    })
  },

  edit(req: Request, res: Response) {
    SaveRequest(req)

    const { name, email, password } = req.body

    const authHeader = req.headers.authorization

    try {
      const jwtHeader = jwt.verify(String(authHeader), String(process.env.JWT_REFRESH_TOKEN))
      Update([ name, email, password, jwtHeader["uuid"] ])
      return res.status(200).json({ auth: true, message: "User edited with success" })
    } catch (error) {
      return res.status(400).json({ auth: false, message: "JWT token invalid, go back to login page" })
    }
  },

  delete(req: Request, res: Response) {
    SaveRequest(req)

    const { password } = req.body

    const authHeader = req.headers.authorization

    try {
      const jwtHeader = jwt.verify(String(authHeader), String(process.env.JWT_REFRESH_TOKEN))
      Delete([ jwtHeader["uuid"], password ])
      return res.status(200).json({ auth: true, message: "User deleted with success" })
    } catch (error) {
      return res.status(400).json({ auth: false, message: "JWT token invalid, go back to login page" })
    }
  },

  list(req: Request, res: Response) {
    SaveRequest(req)

    Index((rows: any) => {
      return res.status(200).json({ users: rows })
    })
  }
}

export { UserController }