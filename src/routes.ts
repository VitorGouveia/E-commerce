import { Router } from "express"

import { UserController } from "@controllers/UserController"
import { ItemController } from "@controllers/ItemController"
import { SessionController } from "@controllers/SessionController"
import { DashboardController } from "@controllers/DashboardController"

const router = Router()

/* User */
router.post("/user/", UserController.create) /* Create user / Register */
router.post("/user/address", UserController.createAddress) /* Create user / Register */
router.post("/user/login", SessionController.create) /* Authenticate user / Login */ 
router.put("/user/edit", UserController.updateUser) /* Editing user */
router.delete("/user/delete", UserController.delete) /* Deleting a user */ 

router.post("/dashboard/user/:page", UserController.list) /* Listing all users */
router.delete("/dashboard/user", DashboardController.deleteUser) /* Deleting a user */



/* Items */
router.post("/item", ItemController.create) /* Create item */
router.put("/item/edit", ItemController.edit) /* Edits item */
router.patch("/item/rate", ItemController.listRating) /* Rates item */
router.delete("/item/delete", ItemController.delete) /* Deletes item */

router.post("/dashboard/item/:page", ItemController.list) /* List all items */
router.get("/dashboard/item/:category", ItemController.findByCategory) /* List all items by category */

export { router }