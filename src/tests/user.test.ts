import request from "supertest"
import { app } from "../app"
import { User } from "../entities/User"

const CreateUserRequest = {
  name: "vitor",
  email: "vitor@test.com",
  password: "123"
}

describe("User Register", () => {
  it("should create new user entity", async () => {
    let { name, email, password } = CreateUserRequest

    const user = new User({ name, email, password })

    expect(user.uuid).toHaveLength(40)
    expect(user.name).toBe(CreateUserRequest.name)
    expect(user.email).toBe(CreateUserRequest.email)

    // const response = await request(app).post("/user").send(user)
  })

  // it("should")
})