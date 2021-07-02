import { Request } from "express"

import { IImageRepository } from "@v1/repositories"
import { SqliteImageRepository } from "@v1/repositories/implementations"

export class DeleteImageService {
  constructor(
    private imageRepository: IImageRepository
  ) {}

  async delete({ id }: any, item_id: number) {
    try {
      await this.imageRepository.delete(Number(id), item_id)
    } catch (error) {
      throw new Error(error.message)
    }
  }
}

export default async (request: Request) => {
  try {
    const ImageRepository = new SqliteImageRepository()
    const DeleteImage = new DeleteImageService(ImageRepository)

    await DeleteImage.delete(request.body, Number(request.params.id))

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