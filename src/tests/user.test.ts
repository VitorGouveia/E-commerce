import request from "supertest"
import { prisma } from "../prisma"
import { app } from "../app"

const user_test = {
  name: "vitor",
  email: "gouveia",
  cpf: "000.000.000-00",
  password: "12345"
}

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

    expect(response.body[0].name).toBe(user_test.name)
    expect(response.body[0].email).toBe(user_test.email)
    expect(response.body[0].password).toBe(user_test.password)
    expect(response.status).toBe(200)
  })

  // it("should update user", async () => {
  //   const response = await request(app)
  // })
})