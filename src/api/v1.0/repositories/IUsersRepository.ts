import { User } from "@api/v1.0/entities/User"
import { User as UserType } from "@prisma/client"

export interface IUsersRepository {
  findAll(property?: string, sort?: "asc" | "desc" | string): Promise<UserType[]>
  findById(id: string): Promise<UserType | null>
  findByEmail(email: string): Promise<UserType[]>
  findUserhash(name: string, userhash: string): Promise<UserType[]>
  findAllPagination(page: number, quantity: number, property?: string, sort?: string): Promise<{}> 
  save(user: User): Promise<void>
}