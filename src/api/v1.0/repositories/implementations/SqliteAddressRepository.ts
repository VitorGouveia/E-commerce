import { Address } from "@v1/entities/Address"
import { IAddressRepository } from "../IAddressRepository"

import { prisma } from "@src/prisma"

export class SqliteAddressRepository implements IAddressRepository {
  async save(address: Address): Promise<void> {
    const {
      id,
      city,
      number,
      postal_code,
      state,
      street,
      user_id
    } = address

    await prisma.address.create({
      data: {
        user_id,
        id,
        city,
        number,
        postal_code,
        state,
        street
      }
    })
  }

  async delete(id: number, user_id: string): Promise<void> {
    await prisma.address.deleteMany({
      where: {
        id,
        user_id
      }
    })
  }
}