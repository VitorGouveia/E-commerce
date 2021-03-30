import request from "supertest"
import { app } from "../app"
import { User } from "../entities/User"
import { FindByEmail } from "../database/models/UserModel"

const CreateUserRequest = {
  name: "vitor",
  email: "vitor@test2.com",
  password: "123"
}

let { name, email, password } = CreateUserRequest

const user = new User({ name, email, password })

describe("User Register", () => {
  it("should create new user entity", async () => {


    expect(user.uuid).toHaveLength(40)
    expect(user.name).toBe(CreateUserRequest.name)
    expect(user.email).toBe(CreateUserRequest.email)
  })
  
  it("should pass user register route", async () => {
    const response = await request(app).post("/user").send(user)

    expect(response.status == 200 || response.status == 400).toBe(true)
  })

  it("should store user in the database", async () => {
    const response = await request(app).post("/user").send(user)

    FindByEmail(user.email, (rows) => {
      rows.forEach(user2 => {
        expect(user.name).toBe(user2.name)
        expect(user.email).toBe(user2.email)
      })
    })
  })
})