import { Request } from "express"

import { IImageRepository } from "@v1/repositories"
import { SqliteImageRepository } from "@v1/repositories/implementations"

import { Image } from "@v1/entities"

export class CreateImageService {
  constructor(
    private imageRepository: IImageRepository
  ) {}

  async create(id: number, createImageRequest: Image) {
    try {
      const image = new Image(createImageRequest)

      await this.imageRepository.save(id, image)

      return {
        image
      }
    } catch (error) {
      throw new Error(error.message)
    }
  }
}

export default async (request: Request) => {
  try {
    const ImageRepository = new SqliteImageRepository()
    const CreateImage = new CreateImageService(ImageRepository)

    const { image } = await CreateImage.create(Number(request.params.id), request.body)

    return ({
      status: 200,
      message: "Create item image with success!",
      image
    })
  } catch (error) {
    return ({
      error: true,
      status: 400,
      message: "Failed when creating image."
    })
  }
}