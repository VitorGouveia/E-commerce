import { User } from "@v1/entities/User"
import { User as UserType } from "@prisma/client"
export interface IUsersRepository {
  findAll(property?: string, sort?: "asc" | "desc" | string): Promise<UserType[]>
  findById(id: string, select?: string): Promise<UserType | { userhash: string | undefined } | null>
  findByEmail(email: string): Promise<UserType[]>
  findUserhash(name: string, userhash: string): Promise<UserType[]>
  findUsername(username: string, userhash: string | undefined): Promise<{ id: string; username: string; userhash: string; }[]>
  findAllPagination(page: number, quantity: number, property?: string, sort?: string): Promise<{}>
  update({ id, created_at, ...props }: User): Promise<void>
  save(user: User): Promise<void>
  delete(id: string): Promise<void>
}