import { Router } from "express"

import { ItemController, DashboardController } from "@v1/controllers"

const router = Router()

router.post("/", ItemController.create) /* Creates item */
router.get("/:id?", ItemController.read) /* Lists items */
router.patch("/:id?", ItemController.update) /* Updates an especific item */
router.delete("/:id?", ItemController.delete) /* Deletes item */

/* Image related */
router.post("/image/:id?", ItemController.createImage)
router.delete("/image/:id?", ItemController.removeImage)

/* Rating realted */
router.post("/rate/:id?", ItemController.rateItem) /* Lists an especific item's ratings */

router.post("/load", DashboardController.loadFromFile)

export default router