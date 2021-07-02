import { Request } from "express"

import { IAddressRepository } from "@v1/repositories"
import { SqliteAddressRepository } from "@v1/repositories/implementations"

export class DeleteAddressService {
  constructor(
    private addressRepository: IAddressRepository
  ) {}

  async delete({ id }, user_id: string) {
    try {
      await this.addressRepository.delete(id, user_id)

    } catch (error) {
      console.log(error)
      throw new Error(error.message)
    }
  }
}

export default async (request: Request) => {
  try {
    const AddressRepository = new SqliteAddressRepository()
    const CreateAddress = new DeleteAddressService(AddressRepository)

    await CreateAddress.delete(request.body, request.params.id)

    return ({
      status: 202,
      message: "Address deleted with success!"
    })
  } catch (error) {
    return ({
      error: true,
      status: 400,
      message: error.message
    })
  }
}