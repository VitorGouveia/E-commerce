import { Router } from "express"

import { UserController, SessionController, DashboardController } from "@v1/controllers"

import { authenticate, dashAuthenticate, isIpBanned } from "../middlewares"

const router = Router()

router.post("/", isIpBanned, UserController.create) /* Creates user */
router.get("/:id?", UserController.read) /* Lists users */

router.post("/login", SessionController.create) /* Authenticate user / Login */
router.post("/admin/login", DashboardController.login) /* Authenticate user / Login */

/** Require JWT to execute */
router.patch("/:id?", authenticate, UserController.update) /* Updates an especific user */
router.delete("/:id?", authenticate, UserController.delete) /* Deletes an especific user */
router.post("/address", authenticate, UserController.createAddress) /* Creates an address for an especific user */
router.delete("/address/:id?", authenticate, UserController.deleteAddress) /* Creates an address for an especific user */

router.post("/cart/:id?", authenticate, UserController.createCart)

router.post("/admin", dashAuthenticate, DashboardController.loadAdmin)
router.get("/ban/:id?", dashAuthenticate, DashboardController.banUser)

export default router