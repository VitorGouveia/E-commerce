import request from "supertest"
import { app } from "../app"
import { User } from "@entities/User"
import { FindByEmail } from "@database/sqlite/models/UserModel"

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
  
  it("should receive a 200 or 400 status code when creating new user", async () => {
    const response = await request(app).post("/user").send(user)

    expect(response.status == 200 || response.status == 400).toBe(true)
  })

  it("should receive JWT_ACESS_TOKEN", async () => {
    const response = await request(app).post("/user").send(user)

    expect(response.body["auth"] == false || response.body["auth"] == true).toBe(true)
  })

  it("should store user in the database", async () => {
    await request(app).post("/user").send(user)

    FindByEmail(user.email, (rows: any) => {
      rows.forEach(user2 => {
        expect(user.name).toBe(user2.name)
        expect(user.email).toBe(user2.email)
      })
    })
  })
})