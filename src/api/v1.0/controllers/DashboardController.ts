import { Request, Response } from "express"

import { prisma } from "../../../prisma"

const DashboardController = {
  async deleteUser(request: Request, response: Response) {
    let { id } = request.body

    try {
      const user = await prisma.user.delete({
        where: {
          id
        }
      })

      return response.status(200).json({ user, message: "User deleted with success!" })

    } catch (error) {

      return response.status(500).json({ error: error.name, details: { message: error.message } })
    }
  }
}

export { DashboardController }