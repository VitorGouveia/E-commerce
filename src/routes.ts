import { Router } from "express"

import { UserController } from "./controllers/UserController"
import { SessionController } from "./controllers/SessionController"

const router = Router()

router.post("/", UserController.create)
router.post("/login", SessionController.create)
router.get("/", UserController.list)

export { router }