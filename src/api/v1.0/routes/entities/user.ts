import { Router } from "express"

import { UserController } from "@controllers/UserController"
import { DashboardController } from "@controllers/DashboardController"
import { SessionController } from "@controllers/SessionController"

const router = Router()

router.post("/user", UserController.create) /* Creates user */
router.get("/user/:id?", UserController.list) /* Lists users */
router.patch("/user/:id?", UserController.update) /* Updates an especific user */
router.delete("/user/:id?", UserController.delete) /* Deletes an especific user */

router.delete("/dashboard/user", DashboardController.deleteUser) /* Deletes a user with admin permissions */
router.post("/user/address", UserController.createAddress) /* Creates an address for an especific user */
router.post("/user/login", SessionController.create) /* Authenticate user / Login */


export default router