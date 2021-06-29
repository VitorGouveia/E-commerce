import { Address } from "@v1/entities/Address"

export interface IAddressRepository {
  save(address: Address): Promise<void>
  delete(id: number, user_id: string): Promise<void>
}