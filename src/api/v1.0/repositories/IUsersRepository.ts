import { User } from "../entities/User"
import { User as UserType } from "@prisma/client"

export interface IUsersRepository {
  findByEmail(email: string): Promise<UserType[]>
  findUserhash(name: string, userhash: string): Promise<UserType[]>
  save(user: User): Promise<void>
}