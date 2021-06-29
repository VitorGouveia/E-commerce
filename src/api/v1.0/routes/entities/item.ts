import { Router } from "express"

import { ItemController } from "@v1/controllers"

const router = Router()

router.post("/", ItemController.create) /* Creates item */
router.post("/list/:page", ItemController.list) /* Lists items */
router.patch("/", ItemController.update) /* Updates an especific item */
router.delete("/", ItemController.delete) /* Deletes item */

/* Image related */
router.post("/image", ItemController.createImage)
router.delete("/image", ItemController.removeImage)

/* Rating realted */
router.post("/rate", ItemController.rateItem) /* Lists an especific item's ratings */
router.post("/rate/list", ItemController.listRating) /* List all items by category */
router.get("/list/category/:category", ItemController.findByCategory) /* List all items by category */

export default router