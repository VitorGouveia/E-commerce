import { Router } from "express"

import { UserController } from "@controllers/UserController"
import { ItemController } from "@controllers/ItemController"
import { SessionController } from "@controllers/SessionController"
import { DashboardController } from "@controllers/DashboardController"

const router = Router()

/* User CRUD */
router.post("/user", UserController.create) /* Creates user */
router.post("/user/list", UserController.list) /* Lists users */
router.patch("/user", UserController.update) /* Updates an especific user */
router.delete("/user", UserController.delete) /* Deletes an especific user */ 
router.delete("/dashboard/user", DashboardController.deleteUser) /* Deletes a user with admin permissions */
router.post("/user/address", UserController.createAddress) /* Creates an address for an especific user */

/* User JWT Related */
router.post("/user/login", SessionController.create) /* Authenticate user / Login */ 



/* Items CRUD */
router.post("/item", ItemController.create) /* Creates item */
router.post("/item/:page", ItemController.list) /* Lists items */
router.patch("/item", ItemController.update) /* Updates an especific item */
router.delete("/item/delete", ItemController.delete) /* Deletes item */

/* Other item listing features */
router.post("/item/rate", ItemController.listRating) /* Lists an especific item's ratings */
router.get("/item/:category", ItemController.findByCategory) /* List all items by category */

export { router }