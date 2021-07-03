import { Router } from "express"

import { UserController, SessionController, DashboardController } from "@v1/controllers"

import authenticate from "../middlewares/auth"

const router = Router()

router.post("/", UserController.create) /* Creates user */
router.get("/:id?", UserController.read) /* Lists users */

router.post("/login", SessionController.create) /* Authenticate user / Login */

/** Require JWT to execute */
router.patch("/:id?", authenticate, UserController.update) /* Updates an especific user */
router.delete("/:id?", authenticate, UserController.delete) /* Deletes an especific user */
router.post("/address", authenticate, UserController.createAddress) /* Creates an address for an especific user */
router.delete("/address/:id?", authenticate, UserController.deleteAddress) /* Creates an address for an especific user */

router.post("/cart/:id?", authenticate, UserController.createCart)

router.post("/admin", DashboardController.loadAdmin)

export default router