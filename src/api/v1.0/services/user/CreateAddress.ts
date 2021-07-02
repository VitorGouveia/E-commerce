import { Request } from "express"

import { IAddressRepository } from "@v1/repositories"
import { SqliteAddressRepository } from "@v1/repositories/implementations"

import { Address } from "@v1/entities"

export class CreateAddressService {
  constructor(
    private addressRepository: IAddressRepository
  ) {}

  async create(addressRequest: Address) {
    try {
      const address = new Address(addressRequest)
      
      await this.addressRepository.save(address)
      
      return {
        address
      }
    } catch (error) {
      console.log(error)
      throw new Error(error.message)
    }
  }
}

export default async (request: Request) => {
  try {
    const AddressRepository = new SqliteAddressRepository()
    const CreateAddress = new CreateAddressService(AddressRepository)

    const { address } = await CreateAddress.create(request.body)

    return ({
      status: 201,
      address
    })
  } catch (error) {
    return ({
      error: true,
      status: 400,
      message: error.message
    })
  }
}