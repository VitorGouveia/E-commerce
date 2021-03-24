import { Router } from "express"

import { UserController } from "./controllers/UserController"
import { SessionController } from "./controllers/SessionController"

const router = Router()

router.post("/", UserController.create)
router.post("/login", SessionController.create)
router.put("/edit", UserController.edit)
router.delete("/delete", UserController.delete)
router.get("/", UserController.list)

export { router }