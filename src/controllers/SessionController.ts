import jwt from "jsonwebtoken"
import { Request, Response } from "express"
import { Save as SaveRequest } from "../utils/SaveRequest"
import { FindByEmail } from "../database/models/UserModel"
import { compareSync } from "bcrypt"

const SessionController = {
  create(req: Request, res: Response) {
    SaveRequest(req)

    const { email, password } = req.body

    const authHeader = req.headers.authorization

    try {
      const jwtHeader = jwt.verify(String(authHeader), String(process.env.JWT_ACCESS_TOKEN))
      const refresh_token = jwt.sign({
        uuid: jwtHeader["uuid"],
        name: jwtHeader["name"],
        email: jwtHeader["email"],
        password: jwtHeader["password"]
      }, String(process.env.JWT_REFRESH_TOKEN), { expiresIn: "168h" })

      res.header("authorization", refresh_token)

      return res.status(302).json({
        auth: true,
        jwt: true,
        user: {
          uuid: jwtHeader["uuid"],  
          name: jwtHeader["name"],  
          email: jwtHeader["email"],  
          password: jwtHeader["password"],  
        },
        refresh_token
      })
    } catch (error) {
      FindByEmail(email, users => {
        if(users.length == 0) {
          return res.status(404).json({ auth: false, message: "Wrong e-mail" })
        } else {
          for(let user of users) {
            if(compareSync(password, user.password) != true) {
              return res.status(404).json({ auth: false, message: "Wrong password" })
            }
  
            const refresh_token = jwt.sign({
              uuid: user.uuid,
              name: user.name,
              email: user.email,
              password: user.password
            }, String(process.env.JWT_REFRESH_TOKEN), { expiresIn: "168h" })
  
            res.header("authorization", refresh_token)
            return res.status(302).json({
              auth: true,
              jwt: false,
              user: {
                uuid: user.uuid,
                name: user.name,
                email: user.email,
                password: user.password
              },
              refresh_token
            })
          }
        }
      })
    }
  }
}

export { SessionController }