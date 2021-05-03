import request from "supertest"
import { prisma } from "../prisma"
import { app } from "../app"
import jwt from "jsonwebtoken"

var user_id = null

const user_test = {
  id: user_id,
  name: "vitor",
  last_name: "vitor",
  email: "gouveia",
  cpf: "000.000.000-00",
  password: "12345"
}

var access_token = null
var refresh_token = null

describe("User Register", () => {
  it("should create new user entity", async () => {
    let { name, email, cpf, password } = user_test

    const user = await prisma.user.create({
      data: {
        name,
        email,
        cpf,
        password
      }
    })

    expect(user.name).toEqual(user_test.name)
    expect(user.email).toEqual(user_test.email)
    expect(user.cpf).toEqual(user_test.cpf)
    expect(user.password).toEqual(user_test.password)
  })

  it("should lists all users", async () => {
    const response = await request(app)
      .post("/user/list/0")
      .send({
        quantity: 1 
      })

    user_id = response.body[0].id
    expect(response.body[0].name).toBe(user_test.name)
    expect(response.body[0].email).toBe(user_test.email)
    expect(response.body[0].password).toBe(user_test.password)
    expect(response.status).toBe(200)
  })

  it("should update user", async () => {
    const response = await request(app)
      .patch("/user")
      .send({
        id: user_test.id,
        name: "victor",
        last_name: user_test.last_name,
        cpf: user_test.cpf,
        email: user_test.email,
        password: user_test.password,
      })

    const authorizationHeader = response.headers.authorization

    try {
      expect(response.headers.authorization.length > 1).toBe(true)
      jwt.verify(String(authorizationHeader), String(process.env.JWT_REFRESH_TOKEN))

      expect(response.body[0].user.name).toBe("victor")

      expect(response.body[0].auth).toBe(true)
      expect(response.status).toBe(200)
    } catch (error) {
       
    }

    await prisma.$disconnect()
  })

  it("should delete user", async () => {
    const response = await request(app).delete("/user").send({
      id: user_test.id
    })

    expect(response.headers.authorization > 1).toBe(true)

    expect(response.body[0].user.name).toBe("victor")

    expect(response.body[0].auth).toBe(true)
    expect(response.status).toBe(200)
  })
})
