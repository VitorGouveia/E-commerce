import { Router } from "express"

import { UserController, SessionController } from "@api/v1.0/controllers"

import authenticate from "../middlewares/auth"

const router = Router()

router.post("/", UserController.create) /* Creates user */
router.get("/:id?", UserController.read) /* Lists users */

router.post("/login", SessionController.create) /* Authenticate user / Login */

/** Require JWT to execute */
router.patch("/:id?", authenticate, UserController.update) /* Updates an especific user */
router.delete("/:id?", authenticate, UserController.delete) /* Deletes an especific user */
router.post("/address", authenticate, UserController.createAddress) /* Creates an address for an especific user */

export default router