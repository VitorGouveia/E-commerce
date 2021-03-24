import { Request } from "express"
import { readFileSync, writeFileSync } from "fs"

function Save(req: Request) {
  let { ip, headers, body } = req

  console.log("Saving this request")
}

export { Save }