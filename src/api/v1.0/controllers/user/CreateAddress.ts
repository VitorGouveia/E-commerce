import { Request, Response} from "express"

import { IAddressRepository } from "@v1/repositories/IAddressRepository"
import { SqliteAddressRepository } from "@v1/repositories/implementations/SqliteAddressRepository"

import { Address } from "@v1/entities/Address"

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
      throw new Error(error.message)
    }
  }
}

export default async (request: Request, response: Response) => {
  try {
    const sqliteAddressRepository = new SqliteAddressRepository()
    const createAddress = new CreateAddressService(sqliteAddressRepository)

    const { address } = await createAddress.create(request.body)

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