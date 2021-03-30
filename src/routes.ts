import { Router } from "express"

import { UserController } from "./controllers/UserController"
import { ItemController } from "./controllers/ItemController"
import { SessionController } from "./controllers/SessionController"
import { DashboardController } from "./controllers/DashboardController"

const router = Router()

/* User */
router.post("/user/", UserController.create) /* Create user / Register */
router.post("/user/login", SessionController.create) /* Authenticate user / Login */ 
router.put("/user/edit", UserController.edit) /* Editing user */
router.delete("/user/delete", UserController.delete) /* Deleting a user */ 

router.get("/dashboard/user", UserController.list) /* Listing all users */
router.delete("/dashboard/user", DashboardController.deleteUser) /* Listing all users */



/* Items */
router.post("/item", ItemController.create) /* Create item */
router.put("/item", ItemController.edit) /* Edits item */
router.delete("/item", ItemController.delete) /* Deletes item */

router.get("/dashboard/item", ItemController.list) /* List all items */
router.get("/dashboard/item/:category", ItemController.findByCategory) /* List all items */

export { router }