import { Request } from "express"

import { IImageRepository } from "@v1/repositories"
import { SqliteImageRepository } from "@v1/repositories/implementations"

import { Image } from "@v1/entities"

export class DeleteImageService {
  constructor(
    private imageRepository: IImageRepository
  ) {}

  async create({ id }: any, item_id: number) {
    try {
      console.log(id)
      await this.imageRepository.delete(Number(id), item_id)
    } catch (error) {
      throw new Error(error.message)
    }
  }
}

export default async (request: Request) => {
  try {
    const sqliteImageRepository = new SqliteImageRepository()
    const CreateImage = new DeleteImageService(sqliteImageRepository)

    await CreateImage.create(request.body, Number(request.params.id))

    return ({
      status: 200,
      message: "Deleted item image with success!",
    })
  } catch (error) {
    return ({
      error: true,
      status: 400,
      message: "Failed when deleting image."
    })
  }
}