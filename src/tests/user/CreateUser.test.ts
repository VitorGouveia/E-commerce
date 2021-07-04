import request from "supertest"
import { compare } from "bcrypt"

import { app } from "@src/app"
import { User } from "@v1/entities"

type CreateUserRequestType = {
  name: string
  email: string
  password: string
}

type CreateUserResponseType = {
  status: number

  body: {
    message: string
    user: User
    access_token: string
  }

  headers: {
    authorization: string
  }
}

const CreateUserRequest: CreateUserRequestType = {
  name: "vitor",
  email: "vitor@gmail.com",
  password: "123"
}

describe("User Register", () => {
  it("should create a new user", async () => {
    const { name, email, password } = CreateUserRequest

    const { status, body, headers }: CreateUserResponseType = await request(app)
      .post("/v1/user")
      .send({
        name,
        email,
        password
      })

    const { user } = body

    expect(status).toBe(201)

    expect(headers.authorization).toHaveLength(241)
    expect(user.name).toEqual(name)
    expect(user.email).toEqual(email)

    const comparePassword = await compare(password, user.password)
    expect(comparePassword).toBeTruthy()
  })
})