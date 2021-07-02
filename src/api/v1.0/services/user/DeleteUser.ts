import { Request } from "express"

import { SqliteUsersRepository } from "@v1/repositories/implementations"
import { IUsersRepository } from "@v1/repositories"

export class DeleteUserService {
  constructor(
    private usersRepository: IUsersRepository
  ) {}

  async delete(id: string) {
    try {
      await this.usersRepository.delete(id)
    } catch (error) {
      throw new Error(error.message)
    }
  }
}

export default async (request: Request) => {
  try {
    const UsersRepository = new SqliteUsersRepository()
    const DeleteUser = new DeleteUserService(UsersRepository)

    await DeleteUser.delete(request.params.id)

    return ({
      status: 200,
      message: "User deleted with success"
    })
  } catch (error) {
    return ({
      error: true,
      status: 400,
      message: error.message
    })
  }
}