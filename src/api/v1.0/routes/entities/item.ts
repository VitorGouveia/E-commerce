import { Router } from "express"

import { ItemController } from "@v1/controllers"

const router = Router()

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

export default router