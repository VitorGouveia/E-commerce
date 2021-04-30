import { Router } from "express"

import { UserController } from "@controllers/UserController"
import { ItemController } from "@controllers/ItemController"
import { SessionController } from "@controllers/SessionController"
import { DashboardController } from "@controllers/DashboardController"

const router = Router()

/* User CRUD */
router.post("/user", UserController.create) /* Creates user */
router.post("/user/list/:page", UserController.list) /* Lists users */
// available routes
// /user/list/page?name=<username>
// /user/list/page?name=<username>&sort=<direction>
// use cases
// /user/list/1?name=vitor                  finds all users that contain "vitor"
// /user/list/1?name=vitor&sort=desc        finds all users that contain "vitor" and order them DESC
// /user/list/1?name=vitor&sort=asc         finds all users that contain "vitor" and order them ASC

router.patch("/user", UserController.update) /* Updates an especific user */
router.delete("/user", UserController.delete) /* Deletes an especific user */ 
router.delete("/dashboard/user", DashboardController.deleteUser) /* Deletes a user with admin permissions */
router.post("/user/address", UserController.createAddress) /* Creates an address for an especific user */

/* User JWT Related */
router.post("/user/login", SessionController.create) /* Authenticate user / Login */ 



/* Items CRUD */
router.post("/item", ItemController.create) /* Creates item */
router.post("/item/list/:page", ItemController.list) /* Lists items */
router.patch("/item", ItemController.update) /* Updates an especific item */
router.delete("/item", ItemController.delete) /* Deletes item */

/* Image related */
router.post("/item/image", ItemController.createImage)
router.delete("/item/image", ItemController.removeImage)

/* Rating realted */
router.post("/item/rate", ItemController.rateItem) /* Lists an especific item's ratings */
router.post("/item/rate/list", ItemController.listRating) /* List all items by category */
router.get("/item/list/category/:category", ItemController.findByCategory) /* List all items by category */

export { router }