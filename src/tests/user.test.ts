import request from "supertest"
import { prisma } from "../prisma"
import { app } from "../app"
import { compareSync } from "bcrypt"

var user_id = null
var access_token = ""

const user_test = {
  id: user_id,
  access_token,
  name: "vitor",
  last_name: "vitor",
  email: "gouveia",
  cpf: "000.000.000-00",
  password: "12345"
}

describe("User Register", () => {
  it("should create new user", async () => {
    let { name, email, cpf, password } = user_test

    const response = await request(app).post("/user").send({
      name,
      email,
      cpf,
      password
    })

    access_token = response.body.access_token

    expect(response.body.user.name).toEqual(name)
    expect(response.body.user.email).toEqual(email)
    expect(response.body.user.cpf).toEqual(cpf)
    expect(compareSync(password, response.body.user.password)).toBe(true)
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
    expect(compareSync(user_test.password, response.body[0].password)).toBe(true)
    expect(response.status).toBe(200)
  })

  it("should login", async () => {
    const response = await request(app)
      .post("/user/login")
      .set("authorization", user_test.access_token)
      .send({
        email: user_test.email,
        password: user_test.password
      })
    
    expect(response.status).toBe(302)
  })

  it("should update user", async () => {
    await prisma.user.deleteMany()

    let { name, cpf, email, password } = user_test

    const create_user = await request(app)
      .post("/user")
      .send({
        name,
        cpf,
        email,
        password
      })
    
    const id = create_user.body.user.id
    const access_token = create_user.body.access_token

    const login = await request(app)
      .post("/user/login")
      .set("authorization", access_token)
      .send({
        email: user_test.email,
        password: user_test.password
      })

    const refresh_token = login.body.refresh_token

    const response = await request(app)
      .patch("/user")
      .set("authorization", refresh_token)
      .send({
        id,
        name: "victor",
        last_name: user_test.last_name,
        cpf: user_test.cpf,
        email: user_test.email,
        password: user_test.password,
      })
      
    expect(response.body.user.name).toBe("victor")
    expect(response.body.auth).toBe(true)
    expect(response.status).toBe(200)

    await prisma.$disconnect()
  })

  it("should delete user", async () => {
    const response = await request(app)
      .delete("/user")
      .set("authorization", refresh_token)
      .send({ id })

      
    expect(response.body.auth).toBe(true)
    expect(response.status).toBe(200)
  })
})